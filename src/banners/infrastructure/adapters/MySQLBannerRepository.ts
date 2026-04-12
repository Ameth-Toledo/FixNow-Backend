import { IBannerRepository } from '../../domain/IBannerRepository';
import { Banner } from '../../domain/entities/Banner';
import { BannerRequest } from '../../domain/dto/BannerRequest';
import pool from '../../../core/config/conn';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLBannerRepository implements IBannerRepository {

  async create(data: BannerRequest): Promise<Banner> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO banners (id_empresa, nombre, imagen_url, activo, fecha_inicio, fecha_fin)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.id_empresa,
        data.nombre,
        data.imagen_url ?? null,
        data.activo ?? true,
        data.fecha_inicio,
        data.fecha_fin,
      ]
    );

    const banner = await this.getById(result.insertId);
    if (!banner) throw new Error('Error al recuperar el banner creado');
    return banner;
  }

  async getByEmpresa(id_empresa: number): Promise<Banner[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM banners WHERE id_empresa = ? ORDER BY created_at DESC',
      [id_empresa]
    );
    return rows.map(row => this.mapRow(row));
  }

  async toggle(id: number, activo: boolean): Promise<Banner | null> {
    await pool.execute<ResultSetHeader>(
      'UPDATE banners SET activo = ? WHERE id_banner = ?',
      [activo, id]
    );
    return await this.getById(id);
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM banners WHERE id_banner = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async incrementVistas(id: number): Promise<void> {
    await pool.execute(
      'UPDATE banners SET vistas = vistas + 1 WHERE id_banner = ?',
      [id]
    );
  }

  async incrementClicks(id: number): Promise<void> {
    await pool.execute(
      'UPDATE banners SET clicks = clicks + 1 WHERE id_banner = ?',
      [id]
    );
  }

  private async getById(id: number): Promise<Banner | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM banners WHERE id_banner = ?',
      [id]
    );
    if (rows.length === 0) return null;
    return this.mapRow(rows[0]);
  }

  private mapRow(row: RowDataPacket): Banner {
    return {
      id_banner:    row.id_banner,
      id_empresa:   row.id_empresa,
      nombre:       row.nombre,
      imagen_url:   row.imagen_url,
      activo:       Boolean(row.activo),
      fecha_inicio: row.fecha_inicio instanceof Date
                      ? row.fecha_inicio.toISOString().split('T')[0]
                      : String(row.fecha_inicio),
      fecha_fin:    row.fecha_fin instanceof Date
                      ? row.fecha_fin.toISOString().split('T')[0]
                      : String(row.fecha_fin),
      clicks:       Number(row.clicks ?? 0),
      vistas:       Number(row.vistas ?? 0),
      created_at:   row.created_at ? new Date(row.created_at) : undefined,
    };
  }
}
