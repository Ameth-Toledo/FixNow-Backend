import { IOrdenRepository } from '../../domain/IOrdenRepository';
import { Orden } from '../../domain/entities/Orden';
import { OrdenRequest, OrdenUpdateRequest } from '../../domain/dto/OrdenRequest';
import pool from '../../../core/config/conn';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLOrdenRepository implements IOrdenRepository {

  // Helper: obtiene detalles enriquecidos (nombre producto, imagen, subtotal)
  private async getDetallesEnriquecidos(id_orden: number): Promise<any[]> {
    const [detalles] = await pool.execute<RowDataPacket[]>(
      `SELECT od.*, p.nombre, p.imagen_url, od.subtotal
       FROM orden_detalles od
       JOIN productos p ON od.id_producto = p.id_producto
       WHERE od.id_orden = ?`,
      [id_orden]
    );
    return detalles.map(d => ({
      id_producto: d.id_producto,
      nombre: d.nombre,
      imagen_url: d.imagen_url || null,
      cantidad: d.cantidad,
      precio_unitario: d.precio_unitario,
      subtotal: d.subtotal
    }));
  }

  // Helper: mapea un row de ordenes (con JOIN a users y empresas) a Orden
  private async mapRowToOrden(row: RowDataPacket): Promise<Orden> {
    const productos = await this.getDetallesEnriquecidos(row.id_orden);
    return {
      id_orden: row.id_orden,
      id_usuario: row.id_usuario,
      nombre_cliente: row.nombre_cliente || undefined,
      id_repartidor: row.id_repartidor || null,
      id_empresa: row.id_empresa || null,
      nombre_empresa: row.nombre_empresa || null,
      fecha_orden: row.fecha_orden,
      estado_orden: row.estado_orden,
      monto_total: row.monto_total,
      descripcion: row.descripcion,
      direccion: row.direccion,
      latitud: row.latitud ? parseFloat(row.latitud) : null,
      longitud: row.longitud ? parseFloat(row.longitud) : null,
      metodo_pago: {
        tipo: row.metodo_pago_tipo,
        ultimos4: row.metodo_pago_ultimos4 || undefined
      },
      productos
    };
  }

  // Query base que trae nombre del cliente y nombre de la empresa
  private readonly BASE_SELECT = `
    SELECT o.*,
           CONCAT(u.name, ' ', u.lastname) AS nombre_cliente,
           e.nombre_comercial AS nombre_empresa
    FROM ordenes o
    LEFT JOIN users u ON o.id_usuario = u.id
    LEFT JOIN empresas e ON o.id_empresa = e.id_empresa
  `;

  async createOrden(data: OrdenRequest): Promise<Orden> {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const queryOrden = 'INSERT INTO ordenes (id_usuario, fecha_orden, estado_orden, monto_total, descripcion, direccion, latitud, longitud, metodo_pago_tipo, metodo_pago_ultimos4, id_empresa) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const [result] = await connection.execute<ResultSetHeader>(queryOrden, [
            data.id_usuario,
            data.estado_orden,
            data.monto_total,
            data.descripcion || null,
            data.direccion,
            data.latitud || null,
            data.longitud || null,
            data.metodo_pago.tipo,
            data.metodo_pago.ultimos4 || null,
            data.id_empresa || null
        ]);

        const newId = result.insertId;

        const queryItems = 'INSERT INTO orden_detalles (id_orden, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)';
        for (const item of data.productos) {
            const subtotal = item.cantidad * item.precio_unitario;
            await connection.execute(queryItems, [
                newId,
                item.id_producto,
                item.cantidad,
                item.precio_unitario,
                subtotal
            ]);
        }

        await connection.commit();

        const ordenCompleta = await this.getOrdenById(newId);
        if (!ordenCompleta) throw new Error('Error al recuperar la orden');

        return ordenCompleta;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
  }

  async getOrdenById(id: number): Promise<Orden | null> {
    const query = this.BASE_SELECT + ' WHERE o.id_orden = ?';
    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) return null;

    return this.mapRowToOrden(rows[0]);
  }

  async getAllOrdenes(): Promise<Orden[]> {
    const query = this.BASE_SELECT + ' ORDER BY o.fecha_orden DESC';
    const [rows] = await pool.execute<RowDataPacket[]>(query);
    return Promise.all(rows.map(row => this.mapRowToOrden(row)));
  }

  async getOrdenesByUsuarioId(id_usuario: number): Promise<Orden[]> {
    const query = this.BASE_SELECT + ' WHERE o.id_usuario = ? ORDER BY o.fecha_orden DESC';
    const [rows] = await pool.execute<RowDataPacket[]>(query, [id_usuario]);
    return Promise.all(rows.map(row => this.mapRowToOrden(row)));
  }

  async updateOrden(id: number, data: OrdenUpdateRequest): Promise<Orden | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.estado_orden !== undefined) {
      fields.push('estado_orden = ?');
      values.push(data.estado_orden);
    }

    if (data.monto_total !== undefined) {
      fields.push('monto_total = ?');
      values.push(data.monto_total);
    }

    if (data.descripcion !== undefined) {
      fields.push('descripcion = ?');
      values.push(data.descripcion);
    }

    if (data.id_repartidor !== undefined) {
      fields.push('id_repartidor = ?');
      values.push(data.id_repartidor);
    }

    if (fields.length === 0) {
      return await this.getOrdenById(id);
    }

    values.push(id);
    const query = `UPDATE ordenes SET ${fields.join(', ')} WHERE id_orden = ?`;
    await pool.execute<ResultSetHeader>(query, values);

    return await this.getOrdenById(id);
  }

  async asignarRepartidor(id_orden: number, id_repartidor: number): Promise<Orden | null> {
    await pool.execute<ResultSetHeader>(
      'UPDATE ordenes SET id_repartidor = ? WHERE id_orden = ?',
      [id_repartidor, id_orden]
    );
    return await this.getOrdenById(id_orden);
  }

  async getOrdenesListasParaRecoleccion(): Promise<Orden[]> {
    const query = this.BASE_SELECT + " WHERE o.estado_orden = 'listo_para_recoleccion' ORDER BY o.fecha_orden DESC";
    const [rows] = await pool.execute<RowDataPacket[]>(query);
    return Promise.all(rows.map(row => this.mapRowToOrden(row)));
  }

  async getOrdenesByRepartidorId(id_repartidor: number): Promise<Orden[]> {
    const query = this.BASE_SELECT + " WHERE o.id_repartidor = ? AND o.estado_orden NOT IN ('entregado', 'cancelada') ORDER BY o.fecha_orden DESC";
    const [rows] = await pool.execute<RowDataPacket[]>(query, [id_repartidor]);
    return Promise.all(rows.map(row => this.mapRowToOrden(row)));
  }

  async getOrdenesByEmpresaId(id_empresa: number): Promise<Orden[]> {
    const query = this.BASE_SELECT + ' WHERE o.id_empresa = ? ORDER BY o.fecha_orden DESC';
    const [rows] = await pool.execute<RowDataPacket[]>(query, [id_empresa]);
    return Promise.all(rows.map(row => this.mapRowToOrden(row)));
  }

  async deleteOrden(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM ordenes WHERE id_orden = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}
