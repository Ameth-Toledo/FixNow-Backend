export type UserRole = 'user' | 'admin' | 'repartidor';
export type AccountType = 'person' | 'company';

export interface User {
  id: number;
  name: string;
  secondname: string | null;
  lastname: string;
  secondlastname: string | null;
  email: string;
  password: string;
  phone: string | null;         
  image_profile: string | null;
  role: UserRole;
  account_type: AccountType;
  firebase_token: string | null;
  created_at: Date;
}