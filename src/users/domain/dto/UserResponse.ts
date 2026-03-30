import { AccountType, User, UserRole } from '../entities/User';

export interface UserResponse {
  id: number;
  name: string;
  secondname: string | null;
  lastname: string;
  secondlastname: string | null;
  email: string;
  phone: string | null;
  image_profile: string | null;
  role: UserRole;
  account_type: AccountType;
  company_name: string | null;
  company_tax_id: string | null;
  company_address: string | null;
  firebase_token: string | null;
  created_at: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    name: user.name,
    secondname: user.secondname,
    lastname: user.lastname,
    secondlastname: user.secondlastname,
    email: user.email,
    phone: user.phone,
    image_profile: user.image_profile,
    role: user.role,
    account_type: user.account_type,
    company_name: user.company_name,
    company_tax_id: user.company_tax_id,
    company_address: user.company_address,
    firebase_token: user.firebase_token,
    created_at: user.created_at.toISOString(),
  };
}