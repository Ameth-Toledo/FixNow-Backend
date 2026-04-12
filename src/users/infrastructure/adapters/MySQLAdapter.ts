import { IUserRepository } from '../../domain/IUserRepository';
import { User } from '../../domain/entities/User';
import pool from '../../../core/config/conn';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { checkPassword, hashPassword } from '../../../core/security/hash';

export class MySQLUserRepository implements IUserRepository {
  async save(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const query = `
      INSERT INTO users (
        name,
        secondname,
        lastname,
        secondlastname,
        email,
        password,
        phone,
        image_profile,
        role,
        account_type,
        firebase_token,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await pool.execute<ResultSetHeader>(query, [
      user.name,
      user.secondname,
      user.lastname,
      user.secondlastname,
      user.email,
      user.password,
      user.phone,
      user.image_profile,
      user.role,
      user.account_type,
      user.firebase_token,
    ]);

    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );

    return this.mapRowToUser(rows[0]);
  }

  async getByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) return null;

    return this.mapRowToUser(rows[0]);
  }

  async getByID(id: number): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) return null;

    return this.mapRowToUser(rows[0]);
  }

  async getAll(): Promise<User[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users ORDER BY created_at DESC'
    );

    return rows.map(row => this.mapRowToUser(row));
  }

  async update(user: User): Promise<void> {
    const query = `
      UPDATE users 
      SET name = ?, secondname = ?, lastname = ?, secondlastname = ?, email = ?, password = ?, phone = ?, image_profile = ?, role = ?, account_type = ?, firebase_token = ?
      WHERE id = ?
    `;

    const [result] = await pool.execute<ResultSetHeader>(query, [
      user.name,
      user.secondname,
      user.lastname,
      user.secondlastname,
      user.email,
      user.password,
      user.phone,
      user.image_profile,
      user.role,
      user.account_type,
      user.firebase_token,
      user.id,
    ]);

    if (result.affectedRows === 0) {
      throw new Error('Usuario no encontrado');
    }
  }

  async updateFirebaseToken(id: number, firebaseToken: string | null): Promise<void> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET firebase_token = ? WHERE id = ?',
      [firebaseToken, id]
    );

    if (result.affectedRows === 0) {
      throw new Error('Usuario no encontrado');
    }
  }

  async delete(id: number): Promise<void> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      throw new Error('Usuario no encontrado');
    }
  }

  async getTotal(): Promise<number> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM users'
    );
    return rows[0].total;
  }

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.getByID(id);
    if (!user) throw new Error('Usuario no encontrado');
    if (!user.password) throw new Error('Este usuario usa autenticación social y no tiene contraseña');

    const isValid = await checkPassword(user.password, currentPassword);
    if (!isValid) throw new Error('La contraseña actual es incorrecta');

    if (newPassword.length < 6) throw new Error('La nueva contraseña debe tener al menos 6 caracteres');

    const hashed = await hashPassword(newPassword);
    await pool.execute<ResultSetHeader>(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashed, id]
    );
  }

  private mapRowToUser(row: RowDataPacket): User {
    return {
      id: row.id,
      name: row.name,
      secondname: row.secondname,
      lastname: row.lastname,
      secondlastname: row.secondlastname,
      email: row.email,
      password: row.password,
      phone: row.phone,
      image_profile: row.image_profile,
      role: row.role,
      account_type: row.account_type ?? 'person',
      firebase_token: row.firebase_token ?? null,
      created_at: new Date(row.created_at),
    };
  }
}