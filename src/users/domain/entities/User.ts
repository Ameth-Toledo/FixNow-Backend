export type UserRole = 'user' | 'technician' | 'admin';
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
  company_name: string | null;
  company_tax_id: string | null;
  company_address: string | null;
  firebase_token: string | null;
  created_at: Date;
}