import { IEmpresaRepository } from '../../domain/IEmpresaRepository';
import { Empresa } from '../../domain/entities/Empresa';
import { EmpresaRequest, EmpresaUpdateRequest } from '../../domain/dto/EmpresaRequest';
import pool from '../../../core/config/conn';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLEmpresaRepository implements IEmpresaRepository {

  async createEmpresa(data: EmpresaRequest): Promise<Empresa> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO empresas (id_usuario, nombre_comercial, direccion, telefono_contacto, correo_contacto, logo_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.id_usuario, data.nombre_comercial, data.direccion, data.telefono_contacto, data.correo_contacto, data.logo_url || null]
    );

    const empresa = await this.getEmpresaById(result.insertId);
    if (!empresa) throw new Error('Error al recuperar la empresa');
    return empresa;
  }

  async getAllEmpresas(): Promise<Empresa[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM empresas ORDER BY fecha_registro DESC'
    );
    return rows.map(row => this.mapRow(row));
  }

  async getEmpresaById(id: number): Promise<Empresa | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM empresas WHERE id_empresa = ?',
      [id]
    );
    if (rows.length === 0) return null;
    return this.mapRow(rows[0]);
  }

  async getEmpresaByUsuarioId(id_usuario: number): Promise<Empresa | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM empresas WHERE id_usuario = ?',
      [id_usuario]
    );
    if (rows.length === 0) return null;
    return this.mapRow(rows[0]);
  }

  async updateEmpresa(id: number, data: EmpresaUpdateRequest): Promise<Empresa | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.nombre_comercial !== undefined) { fields.push('nombre_comercial = ?'); values.push(data.nombre_comercial); }
    if (data.direccion !== undefined) { fields.push('direccion = ?'); values.push(data.direccion); }
    if (data.telefono_contacto !== undefined) { fields.push('telefono_contacto = ?'); values.push(data.telefono_contacto); }
    if (data.correo_contacto !== undefined) { fields.push('correo_contacto = ?'); values.push(data.correo_contacto); }
    if (data.logo_url !== undefined) { fields.push('logo_url = ?'); values.push(data.logo_url); }

    if (fields.length === 0) return await this.getEmpresaById(id);

    values.push(id);
    await pool.execute<ResultSetHeader>(
      `UPDATE empresas SET ${fields.join(', ')} WHERE id_empresa = ?`,
      values
    );

    return await this.getEmpresaById(id);
  }

  async deleteEmpresa(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM empresas WHERE id_empresa = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  private mapRow(row: RowDataPacket): Empresa {
    return {
      id_empresa:        row.id_empresa,
      id_usuario:        row.id_usuario,
      nombre_comercial:  row.nombre_comercial,
      direccion:         row.direccion,
      telefono_contacto: row.telefono_contacto,
      correo_contacto:   row.correo_contacto,
      logo_url:          row.logo_url,
      fecha_registro:    new Date(row.fecha_registro),
      precio_asesoria:   row.precio_asesoria != null ? Number(row.precio_asesoria) : null,
      asesoria_activa:   Boolean(row.asesoria_activa),
    };
  }
}
