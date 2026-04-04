import { Request, Response, NextFunction } from 'express';
import { validateJWT } from './auth';
import { UserRole } from '../../users/domain/entities/User';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      email?: string;
      role?: UserRole;
    }
  }
}

export function jwtMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.access_token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'No autenticado - token no encontrado' });
    return;
  }

  const claims = validateJWT(token);
  if (!claims) {
    res.status(401).json({ error: 'Token invalido o expirado' });
    return;
  }

  req.userId = claims.userId;
  req.email = claims.email;
  req.role = claims.role;
  next();
}

export function requireRole(requiredRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.role) {
      res.status(403).json({ error: 'Rol no encontrado en el token' });
      return;
    }

    if (req.role !== requiredRole) {
      res.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
      return;
    }

    next();
  };
}

export function requireAnyRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.role) {
      res.status(403).json({ error: 'Rol no encontrado en el token' });
      return;
    }

    if (!allowedRoles.includes(req.role)) {
      res.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
      return;
    }

    next();
  };
}

export function optionalJWT(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.access_token;

  if (!token) {
    next();
    return;
  }

  const claims = validateJWT(token);

  if (claims) {
    req.userId = claims.userId;
    req.email = claims.email;
    req.role = claims.role;
  }

  next();
}