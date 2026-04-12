import { Router, Request, Response } from 'express';
import { jwtMiddleware, requireRole } from '../../../core/security/jwt_middleware';
import { GetWalletController } from '../controllers/GetWalletController';
import { SolicitarRetiroController } from '../controllers/SolicitarRetiroController';
import { GetRetirosController } from '../controllers/GetRetirosController';
import { ProcesarRetiroController } from '../controllers/ProcesarRetiroController';

export function configureWalletRoutes(
  getWalletCtrl:       GetWalletController,
  solicitarRetiroCtrl: SolicitarRetiroController,
  getRetirosCtrl:      GetRetirosController,
  procesarRetiroCtrl:  ProcesarRetiroController,
): Router {
  const router = Router();

  // ── Empresa ────────────────────────────────────────────────────────────────

  // Consultar saldo del wallet
  router.get(
    '/wallet/:id_empresa',
    jwtMiddleware,
    (req: Request, res: Response) => getWalletCtrl.handle(req, res)
  );

  // Historial de retiros de la empresa
  router.get(
    '/wallet/:id_empresa/retiros',
    jwtMiddleware,
    (req: Request, res: Response) => getRetirosCtrl.handleByEmpresa(req, res)
  );

  // Solicitar un retiro
  router.post(
    '/wallet/retiro',
    jwtMiddleware,
    (req: Request, res: Response) => solicitarRetiroCtrl.handle(req, res)
  );

  // ── Admin ──────────────────────────────────────────────────────────────────

  // Ver todos los retiros (con filtro opcional ?estado=pendiente)
  router.get(
    '/admin/retiros',
    jwtMiddleware,
    requireRole('admin'),
    (req: Request, res: Response) => getRetirosCtrl.handleAll(req, res)
  );

  // Aprobar o rechazar un retiro
  router.put(
    '/admin/retiros/:id_retiro',
    jwtMiddleware,
    requireRole('admin'),
    (req: Request, res: Response) => procesarRetiroCtrl.handle(req, res)
  );

  return router;
}
