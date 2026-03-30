import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { CreateUserController } from '../controllers/CreateUserController';
import { RegisterCompanyController } from '../controllers/RegisterCompanyController';
import { GetAllUsersController } from '../controllers/GetAllUsersController';
import { GetUserByIdController } from '../controllers/GetUserByIdController';
import { UpdateUserController } from '../controllers/UpdateUserController';
import { DeleteUserController } from '../controllers/DeleteUserController';
import { jwtMiddleware } from '../../../core/security/jwt_middleware';
import { upload } from '../../../core/config/multer_config';

export function configureUserRoutes(
  authCtrl: AuthController,
  createUserCtrl: CreateUserController,
  registerCompanyCtrl: RegisterCompanyController,
  getAllUsersCtrl: GetAllUsersController,
  getUserByIdCtrl: GetUserByIdController,
  updateUserCtrl: UpdateUserController,
  deleteUserCtrl: DeleteUserController
): Router {
  const router = Router();

  router.post('/auth/login', (req, res) => authCtrl.login(req, res));
  router.post('/auth/register', upload.single('imagen'), (req, res) => createUserCtrl.execute(req, res));
  router.post('/auth/register/company', upload.single('imagen'), (req, res) => registerCompanyCtrl.execute(req, res));
  router.post('/auth/logout', jwtMiddleware, (req, res) => authCtrl.logout(req, res));
  router.post('/auth/refresh', (req, res) => authCtrl.refreshToken(req, res));
  router.get('/auth/profile', jwtMiddleware, (req, res) => authCtrl.getProfile(req, res));
  router.get('/auth/verify', jwtMiddleware, (req, res) => authCtrl.verifyToken(req, res));
  router.post('/auth/fcm-token', jwtMiddleware, (req, res) => authCtrl.updateFirebaseToken(req, res));
  router.put('/auth/firebase-token', jwtMiddleware, (req, res) => authCtrl.updateFirebaseToken(req, res));

  router.get('/users', jwtMiddleware, (req, res) => getAllUsersCtrl.execute(req, res));
  router.get('/users/:id', jwtMiddleware, (req, res) => getUserByIdCtrl.execute(req, res));
  router.put('/users/:id', jwtMiddleware, upload.single('imagen'), (req, res) => updateUserCtrl.execute(req, res));
  router.delete('/users/:id', jwtMiddleware, (req, res) => deleteUserCtrl.execute(req, res));

  return router;
}