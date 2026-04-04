import { IChatRepository } from '../../domain/IChatRepository';
import { Conversacion } from '../../domain/entities/Conversacion';
import { Mensaje } from '../../domain/entities/Mensaje';
import { CrearConversacionRequest, EnviarMensajeRequest } from '../../domain/dto/ChatRequest';
import pool from '../../../core/config/conn';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLChatRepository implements IChatRepository {

  private readonly BASE_CONV_SELECT = `
    SELECT c.*,
           CONCAT(u.name, ' ', u.lastname) AS nombre_usuario,
           e.nombre_comercial AS nombre_empresa,
           CONCAT(r.name, ' ', r.lastname) AS nombre_repartidor,
           (SELECT m.contenido FROM mensajes m WHERE m.id_conversacion = c.id_conversacion ORDER BY m.created_at DESC LIMIT 1) AS ultimo_mensaje
    FROM conversaciones c
    LEFT JOIN users u ON c.id_usuario = u.id
    LEFT JOIN empresas e ON c.id_empresa = e.id_empresa
    LEFT JOIN users r ON c.id_repartidor = r.id
  `;

  private mapRowToConversacion(row: RowDataPacket): Conversacion {
    return {
      id_conversacion: row.id_conversacion,
      id_usuario: row.id_usuario,
      nombre_usuario: row.nombre_usuario || undefined,
      id_empresa: row.id_empresa || null,
      nombre_empresa: row.nombre_empresa || null,
      id_repartidor: row.id_repartidor || null,
      nombre_repartidor: row.nombre_repartidor || null,
      tipo: row.tipo,
      ultimo_mensaje: row.ultimo_mensaje || null,
      created_at: row.created_at,
    };
  }

  private mapRowToMensaje(row: RowDataPacket): Mensaje {
    return {
      id_mensaje: row.id_mensaje,
      id_conversacion: row.id_conversacion,
      id_remitente: row.id_remitente,
      nombre_remitente: row.nombre_remitente || undefined,
      contenido: row.contenido,
      leido: Boolean(row.leido),
      created_at: row.created_at,
    };
  }

  async crearConversacion(data: CrearConversacionRequest): Promise<Conversacion> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO conversaciones (id_usuario, id_empresa, id_repartidor, tipo) VALUES (?, ?, ?, ?)',
      [data.id_usuario, data.id_empresa || null, data.id_repartidor || null, data.tipo]
    );
    const conv = await this.getConversacionById(result.insertId);
    if (!conv) throw new Error('Error al crear la conversación');
    return conv;
  }

  async getConversacionById(id: number): Promise<Conversacion | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      this.BASE_CONV_SELECT + ' WHERE c.id_conversacion = ?',
      [id]
    );
    if (rows.length === 0) return null;
    return this.mapRowToConversacion(rows[0]);
  }

  async getConversacionesByUsuarioId(id_usuario: number): Promise<Conversacion[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      this.BASE_CONV_SELECT + ' WHERE c.id_usuario = ? ORDER BY c.created_at DESC',
      [id_usuario]
    );
    return rows.map(row => this.mapRowToConversacion(row));
  }

  async getConversacionesByEmpresaId(id_empresa: number): Promise<Conversacion[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      this.BASE_CONV_SELECT + ' WHERE c.id_empresa = ? ORDER BY c.created_at DESC',
      [id_empresa]
    );
    return rows.map(row => this.mapRowToConversacion(row));
  }

  async getConversacionesByRepartidorId(id_repartidor: number): Promise<Conversacion[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      this.BASE_CONV_SELECT + ' WHERE c.id_repartidor = ? ORDER BY c.created_at DESC',
      [id_repartidor]
    );
    return rows.map(row => this.mapRowToConversacion(row));
  }

  async enviarMensaje(data: EnviarMensajeRequest): Promise<Mensaje> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO mensajes (id_conversacion, id_remitente, contenido) VALUES (?, ?, ?)',
      [data.id_conversacion, data.id_remitente, data.contenido]
    );
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT m.*, CONCAT(u.name, ' ', u.lastname) AS nombre_remitente
       FROM mensajes m
       LEFT JOIN users u ON m.id_remitente = u.id
       WHERE m.id_mensaje = ?`,
      [result.insertId]
    );
    return this.mapRowToMensaje(rows[0]);
  }

  async getMensajesByConversacionId(id_conversacion: number): Promise<Mensaje[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT m.*, CONCAT(u.name, ' ', u.lastname) AS nombre_remitente
       FROM mensajes m
       LEFT JOIN users u ON m.id_remitente = u.id
       WHERE m.id_conversacion = ?
       ORDER BY m.created_at ASC`,
      [id_conversacion]
    );
    return rows.map(row => this.mapRowToMensaje(row));
  }

  async marcarMensajesLeidos(id_conversacion: number, id_usuario: number): Promise<void> {
    await pool.execute(
      'UPDATE mensajes SET leido = TRUE WHERE id_conversacion = ? AND id_remitente != ?',
      [id_conversacion, id_usuario]
    );
  }
}
