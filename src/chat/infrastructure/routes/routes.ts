import { Router, Request, Response } from 'express';
import { CrearConversacionController } from '../controllers/CrearConversacionController';
import { GetConversacionesController } from '../controllers/GetConversacionesController';
import { GetMensajesController } from '../controllers/GetMensajesController';
import { MarcarLeidoController } from '../controllers/MarcarLeidoController';
import { jwtMiddleware } from '../../../core/security/jwt_middleware';

export function configureChatRoutes(
  crearConversacionCtrl: CrearConversacionController,
  getConversacionesCtrl: GetConversacionesController,
  getMensajesCtrl: GetMensajesController,
  marcarLeidoCtrl: MarcarLeidoController
): Router {
  const router = Router();

  // Crear conversación
  router.post('/conversaciones', jwtMiddleware, (req: Request, res: Response) =>
    crearConversacionCtrl.handle(req, res));

  // Obtener conversaciones por actor
  router.get('/usuarios/:id_usuario/conversaciones', jwtMiddleware, (req: Request, res: Response) =>
    getConversacionesCtrl.handleByUsuario(req, res));
  router.get('/empresas/:id_empresa/conversaciones', jwtMiddleware, (req: Request, res: Response) =>
    getConversacionesCtrl.handleByEmpresa(req, res));
  router.get('/repartidores/:id_repartidor/conversaciones', jwtMiddleware, (req: Request, res: Response) =>
    getConversacionesCtrl.handleByRepartidor(req, res));

  // Obtener mensajes de una conversación (historial)
  router.get('/conversaciones/:id_conversacion/mensajes', jwtMiddleware, (req: Request, res: Response) =>
    getMensajesCtrl.handle(req, res));

  // Marcar mensajes como leídos
  router.patch('/conversaciones/:id_conversacion/leido', jwtMiddleware, (req: Request, res: Response) =>
    marcarLeidoCtrl.handle(req, res));

  return router;
}
