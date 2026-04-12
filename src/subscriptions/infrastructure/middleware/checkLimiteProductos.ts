import { Request, Response, NextFunction } from 'express';
import { ISuscripcionRepository } from '../../domain/ISuscripcionRepository';
import pool from '../../../core/config/conn';
import { RowDataPacket } from 'mysql2';

export function checkLimiteProductos(repo: ISuscripcionRepository) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id_usuario = req.userId;
      if (!id_usuario) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      // 1. Obtener la empresa del usuario
      const [empresaRows] = await pool.execute<RowDataPacket[]>(
        'SELECT id_empresa FROM empresas WHERE id_usuario = ?',
        [id_usuario]
      );

      if (!empresaRows.length) {
        // No es empresa — dejar pasar (repartidor u otro rol)
        next();
        return;
      }

      const id_empresa = empresaRows[0].id_empresa;

      // 2. Obtener suscripción activa y su límite
      const suscripcion = await repo.getSuscripcionActivaByUsuarioId(id_usuario);

      if (!suscripcion) {
        res.status(403).json({ error: 'Se requiere una suscripción activa para publicar productos', code: 'NO_SUBSCRIPTION' });
        return;
      }

      if (suscripcion.estado === 'vencida' || suscripcion.estado === 'cancelada') {
        res.status(403).json({ error: 'Suscripción vencida. Renueva tu plan para publicar productos', code: 'SUBSCRIPTION_EXPIRED' });
        return;
      }

      // 3. Obtener el límite del plan
      const [planRows] = await pool.execute<RowDataPacket[]>(
        'SELECT limite_productos FROM planes WHERE id_plan = ?',
        [suscripcion.id_plan]
      );

      const limite: number | null = planRows[0]?.limite_productos ?? null;

      // NULL = ilimitado (plan Pro)
      if (limite === null) {
        next();
        return;
      }

      // 4. Contar productos actuales de la empresa
      const [countRows] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) AS total FROM productos WHERE id_empresa = ?',
        [id_empresa]
      );

      const total = Number(countRows[0]?.total ?? 0);

      if (total >= limite) {
        res.status(403).json({
          error: `Tu plan permite hasta ${limite} productos. Ya tienes ${total}. Actualiza tu plan para publicar más.`,
          code: 'PRODUCT_LIMIT_REACHED',
          limite,
          total,
        });
        return;
      }

      next();
    } catch (error: any) {
      res.status(500).json({ error: 'Error al verificar límite de productos' });
    }
  };
}
