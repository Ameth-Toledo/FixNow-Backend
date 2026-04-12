import { Router, Request, Response } from 'express';
import { jwtMiddleware } from '../../../core/security/jwt_middleware';
import { ConfigurarAsesoriaController } from '../controllers/ConfigurarAsesoriaController';
import { IniciarPagoAsesoriaController } from '../controllers/IniciarPagoAsesoriaController';
import { ConfirmarPagoAsesoriaController } from '../controllers/ConfirmarPagoAsesoriaController';
import { GetAccesoAsesoriaController } from '../controllers/GetAccesoAsesoriaController';

export function configureAsesoriaRoutes(
  configurarCtrl: ConfigurarAsesoriaController,
  iniciarCtrl:    IniciarPagoAsesoriaController,
  confirmarCtrl:  ConfirmarPagoAsesoriaController,
  getAccesoCtrl:  GetAccesoAsesoriaController,
): Router {
  const router = Router();

  // La empresa (o admin) configura el precio y activa/desactiva la asesoría
  router.put(
    '/asesoria/configurar',
    jwtMiddleware,
    (req: Request, res: Response) => configurarCtrl.handle(req, res)
  );

  // El usuario inicia el pago → recibe approveUrl de PayPal
  router.post(
    '/asesoria/pago/iniciar',
    jwtMiddleware,
    (req: Request, res: Response) => iniciarCtrl.handle(req, res)
  );

  // PayPal redirige aquí tras la aprobación (sin JWT — es un browser redirect)
  router.get(
    '/asesoria/pago/confirmar',
    (req: Request, res: Response) => confirmarCtrl.handle(req, res)
  );

  // Consultar si el usuario tiene acceso activo a la asesoría de una empresa
  router.get(
    '/asesoria/acceso/:id_empresa',
    jwtMiddleware,
    (req: Request, res: Response) => getAccesoCtrl.handle(req, res)
  );

  return router;
}
