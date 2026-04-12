import { Router, Request, Response } from 'express';
import { jwtMiddleware, requireRole } from '../../../core/security/jwt_middleware';
import { GetPlanesController } from '../controllers/GetPlanesController';
import { IniciarSuscripcionController } from '../controllers/IniciarSuscripcionController';
import { RetornoPayPalController } from '../controllers/RetornoPayPalController';
import { WebhookController } from '../controllers/WebhookController';
import { GetEstadoController } from '../controllers/GetEstadoController';
import { CancelarSuscripcionController } from '../controllers/CancelarSuscripcionController';
import { SetupPlanesController } from '../controllers/SetupPlanesController';

export function configureSuscripcionesRoutes(
  getPlanesCtrl: GetPlanesController,
  iniciarCtrl: IniciarSuscripcionController,
  retornoCtrl: RetornoPayPalController,
  webhookCtrl: WebhookController,
  getEstadoCtrl: GetEstadoController,
  cancelarCtrl: CancelarSuscripcionController,
  setupPlanesCtrl: SetupPlanesController
): Router {
  const router = Router();

  // Públicas
  router.get('/planes', (req: Request, res: Response) => getPlanesCtrl.handle(req, res));

  // Webhook de PayPal — sin JWT (PayPal no envía token)
  router.post('/suscripciones/webhook', (req: Request, res: Response) => webhookCtrl.handle(req, res));

  // Return URL que llama PayPal tras la aprobación del usuario
  router.get('/suscripciones/retorno', (req: Request, res: Response) => retornoCtrl.handle(req, res));

  // Ruta de cancelación desde PayPal (redirect)
  router.get('/suscripciones/cancelado', (_req: Request, res: Response) => {
    const deepLink = process.env.APP_DEEP_LINK || 'voltio://suscripcion/cancelado';
    res.redirect(deepLink);
  });

  // Protegidas con JWT
  router.post('/suscripciones/iniciar', jwtMiddleware, (req: Request, res: Response) => iniciarCtrl.handle(req, res));
  router.get('/suscripciones/estado/:id_usuario', jwtMiddleware, (req: Request, res: Response) => getEstadoCtrl.handle(req, res));
  router.post('/suscripciones/cancelar', jwtMiddleware, (req: Request, res: Response) => cancelarCtrl.handle(req, res));

  // Solo admin — setup inicial de planes en PayPal (ejecutar una sola vez)
  // TODO: volver a poner requireRole('admin') después de pruebas
  router.post('/admin/suscripciones/setup-planes', jwtMiddleware, (req: Request, res: Response) => setupPlanesCtrl.handle(req, res));

  return router;
}
