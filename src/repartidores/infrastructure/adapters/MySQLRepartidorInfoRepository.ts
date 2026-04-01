import { IRepartidorInfoRepository } from '../../domain/IRepartidorInfoRepository';
import { RepartidorInfo } from '../../domain/entities/RepartidorInfo';
import { RepartidorInfoRequest, RepartidorInfoUpdateRequest } from '../../domain/dto/RepartidorInfoRequest';
import { RepartidorDisponibleResponse } from '../../domain/dto/RepartidorInfoResponse';
import pool from '../../../core/config/conn';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLRepartidorInfoRepository implements IRepartidorInfoRepository {

  async create(data: RepartidorInfoRequest): Promise<RepartidorInfo> {
    const query = `INSERT INTO repartidores_info (id_usuario, vehiculo, placas, esta_activo) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.execute<ResultSetHeader>(query, [
      data.id_usuario,
      data.vehiculo,
      data.placas || null,
      data.esta_activo !== undefined ? data.esta_activo : true
    ]);

    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM repartidores_info WHERE id = ?',
      [result.insertId]
    );

    return this.mapRow(rows[0]);
  }

  async getByUsuarioId(id_usuario: number): Promise<RepartidorInfo | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM repartidores_info WHERE id_usuario = ?',
      [id_usuario]
    );

    if (rows.length === 0) return null;
    return this.mapRow(rows[0]);
  }

  async update(id_usuario: number, data: RepartidorInfoUpdateRequest): Promise<RepartidorInfo | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.vehiculo !== undefined) {
      fields.push('vehiculo = ?');
      values.push(data.vehiculo);
    }

    if (data.placas !== undefined) {
      fields.push('placas = ?');
      values.push(data.placas);
    }

    if (data.esta_activo !== undefined) {
      fields.push('esta_activo = ?');
      values.push(data.esta_activo);
    }

    if (fields.length === 0) {
      return await this.getByUsuarioId(id_usuario);
    }

    values.push(id_usuario);
    const query = `UPDATE repartidores_info SET ${fields.join(', ')} WHERE id_usuario = ?`;
    await pool.execute<ResultSetHeader>(query, values);

    return await this.getByUsuarioId(id_usuario);
  }

  async getDisponibles(): Promise<RepartidorDisponibleResponse[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT u.id, u.name, u.lastname, u.email, u.phone, u.image_profile,
              ri.vehiculo, ri.placas, ri.esta_activo
       FROM users u
       INNER JOIN repartidores_info ri ON u.id = ri.id_usuario
       WHERE u.role = 'repartidor' AND ri.esta_activo = TRUE`
    );

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      lastname: row.lastname,
      email: row.email,
      phone: row.phone,
      image_profile: row.image_profile,
      vehiculo: row.vehiculo,
      placas: row.placas,
      esta_activo: row.esta_activo
    }));
  }

  private mapRow(row: RowDataPacket): RepartidorInfo {
    return {
      id: row.id,
      id_usuario: row.id_usuario,
      vehiculo: row.vehiculo,
      placas: row.placas,
      esta_activo: Boolean(row.esta_activo),
      created_at: new Date(row.created_at)
    };
  }
}
