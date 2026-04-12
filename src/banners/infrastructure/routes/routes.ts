import { Router, Request, Response } from 'express';
import { CreateBannerController } from '../controllers/CreateBannerController';
import { GetBannersByEmpresaController } from '../controllers/GetBannersByEmpresaController';
import { ToggleBannerController } from '../controllers/ToggleBannerController';
import { DeleteBannerController } from '../controllers/DeleteBannerController';
import { jwtMiddleware } from '../../../core/security/jwt_middleware';
import { upload } from '../../../core/config/multer_config';

export function configureBannerRoutes(
  createCtrl:    CreateBannerController,
  getByEmpresaCtrl: GetBannersByEmpresaController,
  toggleCtrl:    ToggleBannerController,
  deleteCtrl:    DeleteBannerController
): Router {
  const router = Router();

  router.get('/banners/empresa/:id_empresa', jwtMiddleware,
    (req: Request, res: Response) => getByEmpresaCtrl.handle(req, res));

  router.post('/banners', jwtMiddleware, upload.single('imagen'),
    (req: Request, res: Response) => createCtrl.handle(req, res));

  router.patch('/banners/:id/toggle', jwtMiddleware,
    (req: Request, res: Response) => toggleCtrl.handle(req, res));

  router.delete('/banners/:id', jwtMiddleware,
    (req: Request, res: Response) => deleteCtrl.handle(req, res));

  return router;
}
