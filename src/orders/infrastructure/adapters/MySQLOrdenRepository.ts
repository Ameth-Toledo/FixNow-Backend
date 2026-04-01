import { IOrdenRepository } from '../../domain/IOrdenRepository';
import { Orden } from '../../domain/entities/Orden';
import { OrdenRequest, OrdenUpdateRequest } from '../../domain/dto/OrdenRequest';
import pool from '../../../core/config/conn';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLOrdenRepository implements IOrdenRepository {
  // En infrastructure/repositories/MySQLOrdenRepository.ts

async createOrden(data: OrdenRequest): Promise<Orden> {
    const connection = await pool.getConnection(); // Usamos conexión directa para transacciones
    try {
        await connection.beginTransaction();

        // 1. Insertar la cabecera de la orden
        const queryOrden = 'INSERT INTO ordenes (id_usuario, fecha_orden, estado_orden, monto_total, descripcion, direccion, metodo_pago_tipo, metodo_pago_ultimos4) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)';
        const [result] = await connection.execute<ResultSetHeader>(queryOrden, [
            data.id_usuario,
            data.estado_orden,
            data.monto_total,
            data.descripcion || null,
            data.direccion,
            data.metodo_pago.tipo,
            data.metodo_pago.ultimos4 || null
        ]);

        const newId = result.insertId;

        // 2. Insertar los productos de la orden
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
        
        // 3. Retornar la orden completa (puedes llamar a getOrdenById)
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
    const query = `
      SELECT o.*, od.id_producto, od.cantidad, od.precio_unitario, p.nombre as nombre_producto
      FROM ordenes o
      LEFT JOIN orden_detalles od ON o.id_orden = od.id_orden
      LEFT JOIN productos p ON od.id_producto = p.id_producto
      WHERE o.id_orden = ?`;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) return null;

    // Como el JOIN devuelve una fila por cada producto, agrupamos
    const orden: Orden = {
      id_orden: rows[0].id_orden,
      id_usuario: rows[0].id_usuario,
      id_repartidor: rows[0].id_repartidor || null,
      fecha_orden: rows[0].fecha_orden,
      estado_orden: rows[0].estado_orden,
      monto_total: rows[0].monto_total,
      descripcion: rows[0].descripcion,
      direccion: rows[0].direccion,
      metodo_pago: {
        tipo: rows[0].metodo_pago_tipo,
        ultimos4: rows[0].metodo_pago_ultimos4 || undefined
      },
      productos: rows[0].id_producto ? rows.map(row => ({
        id_producto: row.id_producto,
        nombre: row.nombre_producto,
        cantidad: row.cantidad,
        precio_unitario: row.precio_unitario
      })) : []
    };

    return orden;
}

  async getAllOrdenes(): Promise<Orden[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM ordenes ORDER BY fecha_orden DESC'
  );

  // Usamos Promise.all para llenar los productos de cada orden
  return Promise.all(rows.map(async (row) => {
    const [detalles] = await pool.execute<RowDataPacket[]>(
      'SELECT od.*, p.nombre FROM orden_detalles od JOIN productos p ON od.id_producto = p.id_producto WHERE od.id_orden = ?',
      [row.id_orden]
    );

    return {
      id_orden: row.id_orden,
      id_usuario: row.id_usuario,
      id_repartidor: row.id_repartidor || null,
      fecha_orden: row.fecha_orden,
      estado_orden: row.estado_orden,
      monto_total: row.monto_total,
      descripcion: row.descripcion,
      direccion: row.direccion,
      metodo_pago: {
        tipo: row.metodo_pago_tipo,
        ultimos4: row.metodo_pago_ultimos4 || undefined
      },
      productos: detalles.map(d => ({
        id_producto: d.id_producto,
        nombre: d.nombre,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario
      }))
    };
  }));
}

async getOrdenesByUsuarioId(id_usuario: number): Promise<Orden[]> {
  // 1. Obtenemos todas las cabeceras de las órdenes del usuario
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM ordenes WHERE id_usuario = ? ORDER BY fecha_orden DESC',
    [id_usuario]
  );

  // 2. Para cada orden, buscamos sus productos en la tabla orden_detalles
  const ordenesConProductos = await Promise.all(
    rows.map(async (row) => {
      const [detalles] = await pool.execute<RowDataPacket[]>(
        `SELECT od.*, p.nombre 
         FROM orden_detalles od 
         JOIN productos p ON od.id_producto = p.id_producto 
         WHERE od.id_orden = ?`,
        [row.id_orden]
      );

      return {
        id_orden: row.id_orden,
        id_usuario: row.id_usuario,
        id_repartidor: row.id_repartidor || null,
        fecha_orden: row.fecha_orden,
        estado_orden: row.estado_orden,
        monto_total: row.monto_total,
        descripcion: row.descripcion,
        direccion: row.direccion,
        metodo_pago: {
          tipo: row.metodo_pago_tipo,
          ultimos4: row.metodo_pago_ultimos4 || undefined
        },
        productos: detalles.map(d => ({
          id_producto: d.id_producto,
          nombre: d.nombre,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario
        }))
      };
    })
  );

  return ordenesConProductos;
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
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM ordenes WHERE estado_orden = 'listo_para_recoleccion' ORDER BY fecha_orden DESC"
    );

    return Promise.all(rows.map(async (row) => {
      const [detalles] = await pool.execute<RowDataPacket[]>(
        'SELECT od.*, p.nombre FROM orden_detalles od JOIN productos p ON od.id_producto = p.id_producto WHERE od.id_orden = ?',
        [row.id_orden]
      );

      return {
        id_orden: row.id_orden,
        id_usuario: row.id_usuario,
        id_repartidor: row.id_repartidor || null,
        fecha_orden: row.fecha_orden,
        estado_orden: row.estado_orden,
        monto_total: row.monto_total,
        descripcion: row.descripcion,
        direccion: row.direccion,
        metodo_pago: {
          tipo: row.metodo_pago_tipo,
          ultimos4: row.metodo_pago_ultimos4 || undefined
        },
        productos: detalles.map(d => ({
          id_producto: d.id_producto,
          nombre: d.nombre,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario
        }))
      };
    }));
  }

  async getOrdenesByRepartidorId(id_repartidor: number): Promise<Orden[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM ordenes WHERE id_repartidor = ? AND estado_orden NOT IN ('entregado', 'cancelada') ORDER BY fecha_orden DESC",
      [id_repartidor]
    );

    return Promise.all(rows.map(async (row) => {
      const [detalles] = await pool.execute<RowDataPacket[]>(
        'SELECT od.*, p.nombre FROM orden_detalles od JOIN productos p ON od.id_producto = p.id_producto WHERE od.id_orden = ?',
        [row.id_orden]
      );

      return {
        id_orden: row.id_orden,
        id_usuario: row.id_usuario,
        id_repartidor: row.id_repartidor || null,
        fecha_orden: row.fecha_orden,
        estado_orden: row.estado_orden,
        monto_total: row.monto_total,
        descripcion: row.descripcion,
        direccion: row.direccion,
        metodo_pago: {
          tipo: row.metodo_pago_tipo,
          ultimos4: row.metodo_pago_ultimos4 || undefined
        },
        productos: detalles.map(d => ({
          id_producto: d.id_producto,
          nombre: d.nombre,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario
        }))
      };
    }));
  }

  async deleteOrden(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM ordenes WHERE id_orden = ?',
      [id]
    );

    return result.affectedRows > 0;
  }
}
