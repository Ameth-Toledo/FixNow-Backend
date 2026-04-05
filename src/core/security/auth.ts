import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { UserRole } from '../../users/domain/entities/User';

const JWT_SECRET = process.env.JWT_SECRET || 'AmethToledo';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'AmethToledoRefresh';

interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
}

interface RefreshPayload {
  userId: number;
}

export function generateJWT(userId: number, email: string, role: UserRole): string {
  const payload: JWTPayload = {
    userId,
    email,
    role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function generateRefreshToken(userId: number): string {
  const payload: RefreshPayload = {
    userId,
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

export function validateJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function validateRefreshToken(token: string): RefreshPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as RefreshPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

export function setRefreshCookie(res: Response, token: string): void {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/api/auth/refresh',
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'strict',
    path: '/',
  });

  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'strict',
    path: '/api/auth/refresh',
  });
}

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}