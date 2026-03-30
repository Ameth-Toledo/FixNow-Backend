import { AccountType, UserRole } from '../entities/User';

export interface UserRequest {
  name: string;
  secondname?: string;
  lastname: string;
  secondlastname?: string;
  email: string;
  password: string;
  phone?: string;
  image_profile?: string;
  role?: UserRole;
  account_type?: AccountType;
  company_name?: string;
  company_tax_id?: string;
  company_address?: string;
  firebase_token?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  firebase_token?: string | null;
}

export interface UpdateUserRequest {
  name?: string;
  secondname?: string;
  lastname?: string;
  secondlastname?: string;
  email?: string;
  phone?: string;
  image_profile?: string;
  company_name?: string;
  company_tax_id?: string;
  company_address?: string;
  firebase_token?: string | null;
}