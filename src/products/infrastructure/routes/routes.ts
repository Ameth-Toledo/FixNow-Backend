import { Router, Request, Response } from 'express';
import { CreateProductController } from '../controllers/CreateProductController';
import { GetAllProductsController } from '../controllers/GetAllProductsController';
import { GetProductByIdController } from '../controllers/GetProductByIdController';
import { UpdateProductController } from '../controllers/UpdateProductController';
import { DeleteProductController } from '../controllers/DeleteProductController';
import { GetProductsByCategoryController } from '../controllers/GetProductsByCategoryController';
import { GetProductsByEmpresaController } from '../controllers/GetProductsByEmpresaController';
import { jwtMiddleware } from '../../../core/security/jwt_middleware';
import { upload } from '../../../core/config/multer_config';
import { checkLimiteProductos } from '../../../subscriptions/infrastructure/middleware/checkLimiteProductos';
import { suscripcionRepository } from '../../../subscriptions/infrastructure/dependencies';

export function configureProductRoutes(
  createProductCtrl: CreateProductController,
  getAllProductsCtrl: GetAllProductsController,
  getProductByIdCtrl: GetProductByIdController,
  updateProductCtrl: UpdateProductController,
  deleteProductCtrl: DeleteProductController,
  getProductsByCategoryCtrl: GetProductsByCategoryController,
  getProductsByEmpresaCtrl: GetProductsByEmpresaController
): Router {
  const router = Router();

  router.get('/products', jwtMiddleware, (req: Request, res: Response) => getAllProductsCtrl.handle(req, res));
  router.get('/products/:id', jwtMiddleware, (req: Request, res: Response) => getProductByIdCtrl.handle(req, res));
  router.get('/products/category/:id_categoria', jwtMiddleware, (req: Request, res: Response) => 
    getProductsByCategoryCtrl.handle(req, res)
  );
  router.get('/products/empresa/:id_empresa', jwtMiddleware, (req: Request, res: Response) => 
    getProductsByEmpresaCtrl.handle(req, res)
  );

  router.post('/products', jwtMiddleware, checkLimiteProductos(suscripcionRepository), upload.single('imagen'), (req: Request, res: Response) =>
    createProductCtrl.handle(req, res)
  );
  router.put('/products/:id', jwtMiddleware, upload.single('imagen'), (req: Request, res: Response) => 
    updateProductCtrl.handle(req, res)
  );
  router.delete('/products/:id', jwtMiddleware, (req: Request, res: Response) => 
    deleteProductCtrl.handle(req, res)
  );

  return router;
}
