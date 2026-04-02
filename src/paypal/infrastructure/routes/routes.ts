import { Router, Request, Response } from 'express';
import { CreatePayPalOrderController } from '../controllers/CreatePayPalOrderController';
import { CapturePayPalOrderController } from '../controllers/CapturePayPalOrderController';
import { jwtMiddleware } from '../../../core/security/jwt_middleware';

export function configurePayPalRoutes(
  createPayPalOrderCtrl: CreatePayPalOrderController,
  capturePayPalOrderCtrl: CapturePayPalOrderController
): Router {
  const router = Router();

  router.post('/paypal/create-order', jwtMiddleware, (req: Request, res: Response) => createPayPalOrderCtrl.handle(req, res));
  router.post('/paypal/capture-order', jwtMiddleware, (req: Request, res: Response) => capturePayPalOrderCtrl.handle(req, res));

  return router;
}
