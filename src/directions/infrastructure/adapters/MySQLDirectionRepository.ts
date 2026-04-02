import { IDirectionRepository } from '../../domain/IDirectionRepository'
import { Direction } from '../../domain/entities/Direction'
import { DirectionRequest, DirectionUpdateRequest } from '../../domain/dto/DirectionRequest'
import pool from '../../../core/config/conn'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

export class MySQLDirectionRepository implements IDirectionRepository {

    async createDirection(data: DirectionRequest): Promise<Direction> {
        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO addresses (id_usuario, alias, direccion, latitud, longitud, es_predeterminada) VALUES (?, ?, ?, ?, ?, ?)',
            [data.id_usuario, data.alias || null, data.direccion, data.latitud || null, data.longitud || null, data.es_predeterminada ?? false]
        )
        const direction = await this.getDirectionById(result.insertId)
        if (!direction) throw new Error('Error al recuperar la dirección')
        return direction
    }

    async getDirectionById(id: number): Promise<Direction | null> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM addresses WHERE id = ?',
            [id]
        )
        if (rows.length === 0) return null
        return this.mapRow(rows[0])
    }

    async getAllDirections(): Promise<Direction[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM addresses ORDER BY created_at DESC'
        )
        return rows.map(this.mapRow)
    }

    async getDirectionsByUserId(id_usuario: number): Promise<Direction[]> {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM addresses WHERE id_usuario = ? ORDER BY es_predeterminada DESC, created_at DESC',
            [id_usuario]
        )
        return rows.map(this.mapRow)
    }

    async updateDirection(id: number, data: DirectionUpdateRequest): Promise<Direction | null> {
        const fields: string[] = []
        const values: any[] = []

        if (data.alias !== undefined) { fields.push('alias = ?'); values.push(data.alias) }
        if (data.direccion !== undefined) { fields.push('direccion = ?'); values.push(data.direccion) }
        if (data.latitud !== undefined) { fields.push('latitud = ?'); values.push(data.latitud) }
        if (data.longitud !== undefined) { fields.push('longitud = ?'); values.push(data.longitud) }
        if (data.es_predeterminada !== undefined) { fields.push('es_predeterminada = ?'); values.push(data.es_predeterminada) }

        if (fields.length === 0) return await this.getDirectionById(id)

        values.push(id)
        await pool.execute<ResultSetHeader>(
            `UPDATE addresses SET ${fields.join(', ')} WHERE id = ?`,
            values
        )
        return await this.getDirectionById(id)
    }

    async deleteDirection(id: number): Promise<boolean> {
        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM addresses WHERE id = ?',
            [id]
        )
        return result.affectedRows > 0
    }

    private mapRow(row: RowDataPacket): Direction {
        return {
            id: row.id,
            id_usuario: row.id_usuario,
            alias: row.alias,
            direccion: row.direccion,
            latitud: row.latitud ? parseFloat(row.latitud) : null,
            longitud: row.longitud ? parseFloat(row.longitud) : null,
            es_predeterminada: row.es_predeterminada === 1,
            created_at: row.created_at
        }
    }
}