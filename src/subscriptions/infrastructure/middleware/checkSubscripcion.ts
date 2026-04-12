import { Request, Response, NextFunction } from 'express';
import { ISuscripcionRepository } from '../../domain/ISuscripcionRepository';

export function checkSubscripcion(repo: ISuscripcionRepository) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id_usuario = req.userId;
      if (!id_usuario) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const suscripcion = await repo.getSuscripcionActivaByUsuarioId(id_usuario);

      if (!suscripcion) {
        res.status(403).json({ error: 'Se requiere una suscripción activa', code: 'NO_SUBSCRIPTION' });
        return;
      }

      if (suscripcion.estado === 'vencida' || suscripcion.estado === 'cancelada') {
        res.status(403).json({ error: 'Suscripción vencida o cancelada', code: 'SUBSCRIPTION_EXPIRED' });
        return;
      }

      if (suscripcion.estado === 'gracia') {
        // Permitir acceso pero informar que está en gracia
        const diasRestantes = suscripcion.fecha_fin_gracia
          ? Math.max(0, Math.ceil((new Date(suscripcion.fecha_fin_gracia).getTime() - Date.now()) / 86400000))
          : 0;
        res.setHeader('X-Subscription-Grace', 'true');
        res.setHeader('X-Grace-Days-Remaining', String(diasRestantes));
      }

      next();
    } catch (error: any) {
      res.status(500).json({ error: 'Error al verificar suscripción' });
    }
  };
}
