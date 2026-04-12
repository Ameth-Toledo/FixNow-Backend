import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../../../core/config/conn';
import { ISuscripcionRepository } from '../../domain/ISuscripcionRepository';
import { Plan } from '../../domain/entities/Plan';
import { Suscripcion } from '../../domain/entities/Suscripcion';

const DIAS_GRACIA = 5;

export class MySQLSuscripcionRepository implements ISuscripcionRepository {

  private mapPlan(row: RowDataPacket): Plan {
    return {
      id_plan:          row.id_plan,
      nombre:           row.nombre,
      tipo_rol:         row.tipo_rol,
      precio:           Number(row.precio),
      descripcion:      row.descripcion || null,
      limite_productos: row.limite_productos != null ? Number(row.limite_productos) : null,
      paypal_plan_id:   row.paypal_plan_id || null,
      activo:           Boolean(row.activo),
    };
  }

  private mapSuscripcion(row: RowDataPacket): Suscripcion {
    return {
      id_suscripcion:         row.id_suscripcion,
      id_usuario:             row.id_usuario,
      id_plan:                row.id_plan,
      nombre_plan:            row.nombre_plan || undefined,
      tipo_rol:               row.tipo_rol    || undefined,
      precio_plan:            row.precio_plan  != null ? Number(row.precio_plan) : undefined,
      paypal_subscription_id: row.paypal_subscription_id || null,
      estado:                 row.estado,
      fecha_inicio:           row.fecha_inicio    || null,
      fecha_vencimiento:      row.fecha_vencimiento || null,
      fecha_fin_gracia:       row.fecha_fin_gracia  || null,
      created_at:             row.created_at,
      updated_at:             row.updated_at,
    };
  }

  async getPlanes(tipo_rol?: string): Promise<Plan[]> {
    const query = tipo_rol
      ? 'SELECT * FROM planes WHERE activo = 1 AND tipo_rol = ?'
      : 'SELECT * FROM planes WHERE activo = 1';
    const params = tipo_rol ? [tipo_rol] : [];
    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return rows.map(r => this.mapPlan(r));
  }

  async getPlanById(id_plan: number): Promise<Plan | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM planes WHERE id_plan = ?',
      [id_plan]
    );
    return rows.length ? this.mapPlan(rows[0]) : null;
  }

  async crearSuscripcion(data: {
    id_usuario: number;
    id_plan: number;
    paypal_subscription_id: string;
  }): Promise<Suscripcion> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO suscripciones (id_usuario, id_plan, paypal_subscription_id, estado)
       VALUES (?, ?, ?, 'pendiente')`,
      [data.id_usuario, data.id_plan, data.paypal_subscription_id]
    );

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT s.*, p.nombre AS nombre_plan, p.tipo_rol, p.precio AS precio_plan
       FROM suscripciones s
       JOIN planes p ON s.id_plan = p.id_plan
       WHERE s.id_suscripcion = ?`,
      [result.insertId]
    );
    return this.mapSuscripcion(rows[0]);
  }

  async getSuscripcionActivaByUsuarioId(id_usuario: number): Promise<Suscripcion | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT s.*, p.nombre AS nombre_plan, p.tipo_rol, p.precio AS precio_plan
       FROM suscripciones s
       JOIN planes p ON s.id_plan = p.id_plan
       WHERE s.id_usuario = ?
         AND s.estado NOT IN ('vencida', 'cancelada')
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [id_usuario]
    );
    return rows.length ? this.mapSuscripcion(rows[0]) : null;
  }

  async getSuscripcionByPayPalId(paypal_subscription_id: string): Promise<Suscripcion | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT s.*, p.nombre AS nombre_plan, p.tipo_rol, p.precio AS precio_plan
       FROM suscripciones s
       JOIN planes p ON s.id_plan = p.id_plan
       WHERE s.paypal_subscription_id = ?`,
      [paypal_subscription_id]
    );
    return rows.length ? this.mapSuscripcion(rows[0]) : null;
  }

  async activarSuscripcion(paypal_subscription_id: string): Promise<void> {
    await pool.execute(
      `UPDATE suscripciones
       SET estado             = 'activa',
           fecha_inicio       = NOW(),
           fecha_vencimiento  = DATE_ADD(NOW(), INTERVAL 30 DAY),
           fecha_fin_gracia   = DATE_ADD(NOW(), INTERVAL ${30 + DIAS_GRACIA} DAY)
       WHERE paypal_subscription_id = ?`,
      [paypal_subscription_id]
    );
  }

  async actualizarEstado(id_suscripcion: number, estado: string): Promise<void> {
    await pool.execute(
      'UPDATE suscripciones SET estado = ? WHERE id_suscripcion = ?',
      [estado, id_suscripcion]
    );
  }

  async cancelarSuscripcion(id_usuario: number): Promise<void> {
    await pool.execute(
      `UPDATE suscripciones SET estado = 'cancelada'
       WHERE id_usuario = ? AND estado NOT IN ('vencida', 'cancelada')`,
      [id_usuario]
    );
  }

  async getSuscripcionesVencidasSinGracia(): Promise<Suscripcion[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT s.*, p.nombre AS nombre_plan, p.tipo_rol, p.precio AS precio_plan
       FROM suscripciones s
       JOIN planes p ON s.id_plan = p.id_plan
       WHERE s.estado = 'activa'
         AND s.fecha_vencimiento < NOW()`,
    );
    return rows.map(r => this.mapSuscripcion(r));
  }

  async getSuscripcionesGraciaExpirada(): Promise<Suscripcion[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT s.*, p.nombre AS nombre_plan, p.tipo_rol, p.precio AS precio_plan
       FROM suscripciones s
       JOIN planes p ON s.id_plan = p.id_plan
       WHERE s.estado = 'gracia'
         AND s.fecha_fin_gracia < NOW()`,
    );
    return rows.map(r => this.mapSuscripcion(r));
  }
}
