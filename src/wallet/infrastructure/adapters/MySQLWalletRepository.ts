import { IWalletRepository } from '../../domain/IWalletRepository';
import { Wallet } from '../../domain/entities/Wallet';
import { Retiro, EstadoRetiro, MetodoRetiro } from '../../domain/entities/Retiro';
import pool from '../../../core/config/conn';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLWalletRepository implements IWalletRepository {

  private mapWallet(row: RowDataPacket): Wallet {
    return {
      id_wallet:        row.id_wallet,
      id_empresa:       row.id_empresa,
      saldo_disponible: Number(row.saldo_disponible),
      saldo_retenido:   Number(row.saldo_retenido),
      total_ganado:     Number(row.total_ganado),
      updated_at:       row.updated_at,
    };
  }

  private mapRetiro(row: RowDataPacket): Retiro {
    return {
      id_retiro:    row.id_retiro,
      id_empresa:   row.id_empresa,
      monto:        Number(row.monto),
      metodo:       row.metodo as MetodoRetiro,
      datos_cuenta: typeof row.datos_cuenta === 'string'
        ? JSON.parse(row.datos_cuenta)
        : row.datos_cuenta,
      estado:       row.estado as EstadoRetiro,
      notas_admin:  row.notas_admin ?? null,
      procesado_at: row.procesado_at ?? null,
      created_at:   row.created_at,
    };
  }

  // ── Wallet ─────────────────────────────────────────────────────────────────

  async getWallet(id_empresa: number): Promise<Wallet | null> {
    // Asegurar que exista un wallet para esta empresa (crea uno en $0 si no hay)
    await pool.execute(
      `INSERT INTO wallet_empresas (id_empresa, saldo_disponible, saldo_retenido, total_ganado)
       VALUES (?, 0.00, 0.00, 0.00)
       ON DUPLICATE KEY UPDATE id_empresa = id_empresa`,
      [id_empresa]
    );
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM wallet_empresas WHERE id_empresa = ?',
      [id_empresa]
    );
    return rows.length ? this.mapWallet(rows[0]) : null;
  }

  // ── Retiros ────────────────────────────────────────────────────────────────

  async solicitarRetiro(data: {
    id_empresa:   number;
    monto:        number;
    metodo:       MetodoRetiro;
    datos_cuenta: Record<string, any>;
  }): Promise<Retiro> {
    // Descontar del saldo disponible y registrar en saldo_retenido (pendiente de procesar)
    await pool.execute(
      `UPDATE wallet_empresas
       SET saldo_disponible = saldo_disponible - ?,
           saldo_retenido   = saldo_retenido   + ?
       WHERE id_empresa = ?`,
      [data.monto, data.monto, data.id_empresa]
    );

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO retiros (id_empresa, monto, metodo, datos_cuenta, estado)
       VALUES (?, ?, ?, ?, 'pendiente')`,
      [data.id_empresa, data.monto, data.metodo, JSON.stringify(data.datos_cuenta)]
    );

    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM retiros WHERE id_retiro = ?',
      [result.insertId]
    );
    return this.mapRetiro(rows[0]);
  }

  async getRetirosByEmpresa(id_empresa: number): Promise<Retiro[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM retiros WHERE id_empresa = ? ORDER BY created_at DESC',
      [id_empresa]
    );
    return rows.map(r => this.mapRetiro(r));
  }

  async getAllRetiros(estado?: EstadoRetiro): Promise<Retiro[]> {
    const query = estado
      ? 'SELECT * FROM retiros WHERE estado = ? ORDER BY created_at DESC'
      : 'SELECT * FROM retiros ORDER BY created_at DESC';
    const params = estado ? [estado] : [];
    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return rows.map(r => this.mapRetiro(r));
  }

  async procesarRetiro(id_retiro: number, estado: EstadoRetiro, notas_admin?: string): Promise<void> {
    // Si se rechaza, devolver el monto al saldo disponible
    if (estado === 'rechazado') {
      await pool.execute(
        `UPDATE wallet_empresas w
         JOIN retiros r ON r.id_empresa = w.id_empresa
         SET w.saldo_disponible = w.saldo_disponible + r.monto,
             w.saldo_retenido   = w.saldo_retenido   - r.monto
         WHERE r.id_retiro = ? AND r.estado = 'pendiente'`,
        [id_retiro]
      );
    } else {
      // Si se procesa, solo quitar de saldo_retenido (ya se descontó al solicitar)
      await pool.execute(
        `UPDATE wallet_empresas w
         JOIN retiros r ON r.id_empresa = w.id_empresa
         SET w.saldo_retenido = w.saldo_retenido - r.monto
         WHERE r.id_retiro = ? AND r.estado = 'pendiente'`,
        [id_retiro]
      );
    }

    await pool.execute(
      `UPDATE retiros
       SET estado       = ?,
           notas_admin  = ?,
           procesado_at = NOW()
       WHERE id_retiro = ?`,
      [estado, notas_admin ?? null, id_retiro]
    );
  }
}
