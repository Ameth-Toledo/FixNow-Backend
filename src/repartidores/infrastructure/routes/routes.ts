import { Router, Request, Response } from 'express';
import { CreateRepartidorInfoController } from '../controllers/CreateRepartidorInfoController';
import { UpdateRepartidorInfoController } from '../controllers/UpdateRepartidorInfoController';
import { GetRepartidoresDisponiblesController } from '../controllers/GetRepartidoresDisponiblesController';
import { GetRepartidorInfoByUsuarioIdController } from '../controllers/GetRepartidorInfoByUsuarioIdController';
import { jwtMiddleware } from '../../../core/security/jwt_middleware';

export function configureRepartidoresRoutes(
  createRepartidorInfoCtrl: CreateRepartidorInfoController,
  updateRepartidorInfoCtrl: UpdateRepartidorInfoController,
  getRepartidoresDisponiblesCtrl: GetRepartidoresDisponiblesController,
  getRepartidorInfoByUsuarioIdCtrl: GetRepartidorInfoByUsuarioIdController
): Router {
  const router = Router();

  // GET /repartidores/disponibles - Lista repartidores activos (para admin)
  router.get('/repartidores/disponibles', jwtMiddleware, (req: Request, res: Response) => getRepartidoresDisponiblesCtrl.handle(req, res));

  // GET /repartidores/:id_usuario - Info de un repartidor
  router.get('/repartidores/:id_usuario', jwtMiddleware, (req: Request, res: Response) => getRepartidorInfoByUsuarioIdCtrl.handle(req, res));

  // POST /repartidores - Crear info de repartidor
  router.post('/repartidores', jwtMiddleware, (req: Request, res: Response) => createRepartidorInfoCtrl.handle(req, res));

  // PUT /repartidores/:id_usuario - Actualizar info de repartidor
  router.put('/repartidores/:id_usuario', jwtMiddleware, (req: Request, res: Response) => updateRepartidorInfoCtrl.handle(req, res));

  return router;
}
