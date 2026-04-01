import { Router, Request, Response } from 'express';
import { CreateOrdenController } from '../controllers/CreateOrdenController';
import { GetAllOrdenesController } from '../controllers/GetAllOrdenesController';
import { GetOrdenByIdController } from '../controllers/GetOrdenByIdController';
import { GetOrdenesByUsuarioIdController } from '../controllers/GetOrdenesByUsuarioIdController';
import { UpdateOrdenController } from '../controllers/UpdateOrdenController';
import { DeleteOrdenController } from '../controllers/DeleteOrdenController';
import { AsignarRepartidorController } from '../controllers/AsignarRepartidorController';
import { GetOrdenesListasParaRecoleccionController } from '../controllers/GetOrdenesListasParaRecoleccionController';
import { GetOrdenesByRepartidorIdController } from '../controllers/GetOrdenesByRepartidorIdController';
import { CambiarEstadoOrdenRepartidorController } from '../controllers/CambiarEstadoOrdenRepartidorController';
import { jwtMiddleware } from '../../../core/security/jwt_middleware';

export function configureOrdenesRoutes(
  createOrdenCtrl: CreateOrdenController,
  getAllOrdenesCtrl: GetAllOrdenesController,
  getOrdenByIdCtrl: GetOrdenByIdController,
  getOrdenesByUsuarioIdCtrl: GetOrdenesByUsuarioIdController,
  updateOrdenCtrl: UpdateOrdenController,
  deleteOrdenCtrl: DeleteOrdenController,
  asignarRepartidorCtrl: AsignarRepartidorController,
  getOrdenesListasCtrl: GetOrdenesListasParaRecoleccionController,
  getOrdenesByRepartidorIdCtrl: GetOrdenesByRepartidorIdController,
  cambiarEstadoRepartidorCtrl: CambiarEstadoOrdenRepartidorController
): Router {
  const router = Router();

  router.get('/ordenes', jwtMiddleware, (req: Request, res: Response) => getAllOrdenesCtrl.handle(req, res));
  router.get('/ordenes/:id', jwtMiddleware, (req: Request, res: Response) => getOrdenByIdCtrl.handle(req, res));
  router.get('/usuarios/:id_usuario/ordenes', jwtMiddleware, (req: Request, res: Response) => getOrdenesByUsuarioIdCtrl.handle(req, res));

  router.post('/ordenes', jwtMiddleware, (req: Request, res: Response) => createOrdenCtrl.handle(req, res));
  router.put('/ordenes/:id', jwtMiddleware, (req: Request, res: Response) => updateOrdenCtrl.handle(req, res));
  router.delete('/ordenes/:id', jwtMiddleware, (req: Request, res: Response) => deleteOrdenCtrl.handle(req, res));

  // Rutas para administrador
  router.patch('/ordenes/:id/asignar', jwtMiddleware, (req: Request, res: Response) => asignarRepartidorCtrl.handle(req, res));

  // Rutas para repartidor
  router.get('/repartidor/ordenes-pendientes', jwtMiddleware, (req: Request, res: Response) => getOrdenesListasCtrl.handle(req, res));
  router.get('/repartidor/:id_repartidor/mi-ruta', jwtMiddleware, (req: Request, res: Response) => getOrdenesByRepartidorIdCtrl.handle(req, res));
  router.patch('/ordenes/:id/estado', jwtMiddleware, (req: Request, res: Response) => cambiarEstadoRepartidorCtrl.handle(req, res));

  return router;
}
