import { IAsesoriaRepository } from '../../domain/IAsesoriaRepository';
import { PagoAsesoria } from '../../domain/entities/PagoAsesoria';
import { AccesoAsesoria } from '../../domain/entities/AccesoAsesoria';
import pool from '../../../core/config/conn';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const DIAS_ACCESO = 30;

export class MySQLAsesoriaRepository implements IAsesoriaRepository {

  private mapPago(row: RowDataPacket): PagoAsesoria {
    return {
      id_pago:          row.id_pago,
      id_usuario:       row.id_usuario,
      id_empresa:       row.id_empresa,
      id_conversacion:  row.id_conversacion ?? null,
      paypal_order_id:  row.paypal_order_id,
      monto_total:      Number(row.monto_total),
      monto_empresa:    Number(row.monto_empresa),
      monto_app:        Number(row.monto_app),
      estado:           row.estado,
      fecha_expiracion: row.fecha_expiracion ?? null,
      created_at:       row.created_at,
    };
  }

  // ── Configuración ──────────────────────────────────────────────────────────

  async configurarAsesoria(id_empresa: number, precio: number, activa: boolean): Promise<void> {
    await pool.execute(
      'UPDATE empresas SET precio_asesoria = ?, asesoria_activa = ? WHERE id_empresa = ?',
      [precio, activa, id_empresa]
    );
  }

  // ── Pagos ──────────────────────────────────────────────────────────────────

  async crearPago(data: {
    id_usuario:      number;
    id_empresa:      number;
    paypal_order_id: string;
    monto_total:     number;
    monto_empresa:   number;
    monto_app:       number;
  }): Promise<PagoAsesoria> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO pagos_asesoria
         (id_usuario, id_empresa, paypal_order_id, monto_total, monto_empresa, monto_app, estado)
       VALUES (?, ?, ?, ?, ?, ?, 'pendiente')`,
      [data.id_usuario, data.id_empresa, data.paypal_order_id,
       data.monto_total, data.monto_empresa, data.monto_app]
    );

    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM pagos_asesoria WHERE id_pago = ?',
      [result.insertId]
    );
    return this.mapPago(rows[0]);
  }

  async getPagoByOrderId(paypal_order_id: string): Promise<PagoAsesoria | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM pagos_asesoria WHERE paypal_order_id = ?',
      [paypal_order_id]
    );
    return rows.length ? this.mapPago(rows[0]) : null;
  }

  async confirmarPago(paypal_order_id: string, id_conversacion: number): Promise<void> {
    await pool.execute(
      `UPDATE pagos_asesoria
       SET estado           = 'completado',
           id_conversacion  = ?,
           fecha_expiracion = DATE_ADD(NOW(), INTERVAL ${DIAS_ACCESO} DAY)
       WHERE paypal_order_id = ?`,
      [id_conversacion, paypal_order_id]
    );
  }

  // ── Acceso ─────────────────────────────────────────────────────────────────

  async getAcceso(id_usuario: number, id_empresa: number): Promise<AccesoAsesoria> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id_pago,
              fecha_expiracion,
              DATEDIFF(fecha_expiracion, NOW()) AS dias_restantes
       FROM pagos_asesoria
       WHERE id_usuario     = ?
         AND id_empresa     = ?
         AND estado         = 'completado'
         AND fecha_expiracion > NOW()
       ORDER BY fecha_expiracion DESC
       LIMIT 1`,
      [id_usuario, id_empresa]
    );

    if (!rows.length) {
      return { tiene_acceso: false, id_pago: null, fecha_expiracion: null, dias_restantes: null };
    }

    return {
      tiene_acceso:     true,
      id_pago:          rows[0].id_pago,
      fecha_expiracion: rows[0].fecha_expiracion,
      dias_restantes:   Number(rows[0].dias_restantes),
    };
  }

  // ── Wallet ─────────────────────────────────────────────────────────────────

  async acreditarWallet(id_empresa: number, monto: number): Promise<void> {
    // INSERT ... ON DUPLICATE KEY garantiza que exista el wallet antes de sumar
    await pool.execute(
      `INSERT INTO wallet_empresas (id_empresa, saldo_disponible, saldo_retenido, total_ganado)
       VALUES (?, ?, 0.00, ?)
       ON DUPLICATE KEY UPDATE
         saldo_disponible = saldo_disponible + VALUES(saldo_disponible),
         total_ganado     = total_ganado     + VALUES(total_ganado)`,
      [id_empresa, monto, monto]
    );
  }
}
