import { User } from './entities/User';

export interface IUserRepository {
  save(user: Omit<User, 'id' | 'created_at'>): Promise<User>;
  getByEmail(email: string): Promise<User | null>;
  getByID(id: number): Promise<User | null>;
  getAll(): Promise<User[]>;
  update(user: User): Promise<void>;
  updateFirebaseToken(id: number, firebaseToken: string | null): Promise<void>;
  delete(id: number): Promise<void>;
  getTotal(): Promise<number>;
}