import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { InitCloudinary } from './src/core/config/cloudinary';
import { configureUserRoutes } from './src/users/infrastructure/routes/routes';
import { configureProductRoutes } from './src/products/infrastructure/routes/routes';
import { configureCategoriasRoutes } from './src/categories/infrastructure/routes/routes';
import { configureEspecificacionesRoutes } from './src/specifications/infrastructure/routes/routes';
import { configureOrdenesRoutes } from './src/orders/infrastructure/routes/routes';
import { configureEmpresasRoutes } from './src/empresas/infrastructure/routes/routes';
import { configureRepartidoresRoutes } from './src/repartidores/infrastructure/routes/routes';
import { authController, createUserController, registerCompanyController, googleRegisterCompanyController, getAllUsersController, getUserByIdController, updateUserController, deleteUserController, } from './src/users/infrastructure/dependencies';
import { createProductController, getAllProductsController, getProductByIdController, updateProductController, deleteProductController, getProductsByCategoryController } from './src/products/infrastructure/dependencies';
import { createCategoriaController, getAllCategoriasController, getCategoriaByIdController, updateCategoriaController, deleteCategoriaController } from './src/categories/infrastructure/dependencies';
import { createEspecificacionController, getAllEspecificacionesController, getEspecificacionByIdController, getEspecificacionesByProductIdController, updateEspecificacionController, deleteEspecificacionController } from './src/specifications/infrastructure/dependencies';
import { createOrdenController, getAllOrdenesController, getOrdenByIdController, getOrdenesByUsuarioIdController, updateOrdenController, deleteOrdenController, asignarRepartidorController, getOrdenesListasParaRecoleccionController, getOrdenesByRepartidorIdController, cambiarEstadoOrdenRepartidorController } from './src/orders/infrastructure/dependencies';
import { createEmpresaController, getAllEmpresasController, getEmpresaByIdController, getEmpresaByUsuarioIdController, updateEmpresaController, deleteEmpresaController } from './src/empresas/infrastructure/dependencies';
import { createRepartidorInfoController, updateRepartidorInfoController, getRepartidoresDisponiblesController, getRepartidorInfoByUsuarioIdController } from './src/repartidores/infrastructure/dependencies';
import { configureDirectionRoutes } from './src/directions/infrastructure/routes/routes'
import { createDirectionController, getAllDirectionController, getDirectionByIdController, getDirectionsByUserIdController, updateDirectionController, deleteDirectionController } from './src/directions/infrastructure/dependencies'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

InitCloudinary();

app.use(cors({
  origin: 'frontend_web_app o *',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const userRoutes = configureUserRoutes(
  authController,
  createUserController,
  registerCompanyController,
  googleRegisterCompanyController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController
);

const productRoutes = configureProductRoutes(
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  getProductsByCategoryController
);

const categoriasRoutes = configureCategoriasRoutes(
  createCategoriaController,
  getAllCategoriasController,
  getCategoriaByIdController,
  updateCategoriaController,
  deleteCategoriaController
);

const especificacionesRoutes = configureEspecificacionesRoutes(
  createEspecificacionController,
  getAllEspecificacionesController,
  getEspecificacionByIdController,
  getEspecificacionesByProductIdController,
  updateEspecificacionController,
  deleteEspecificacionController
);

const ordenesRoutes = configureOrdenesRoutes(
  createOrdenController,
  getAllOrdenesController,
  getOrdenByIdController,
  getOrdenesByUsuarioIdController,
  updateOrdenController,
  deleteOrdenController,
  asignarRepartidorController,
  getOrdenesListasParaRecoleccionController,
  getOrdenesByRepartidorIdController,
  cambiarEstadoOrdenRepartidorController
);

const directionRoutes = configureDirectionRoutes(
    createDirectionController,
    getAllDirectionController,
    getDirectionByIdController,
    getDirectionsByUserIdController,
    updateDirectionController,
    deleteDirectionController
)

const empresasRoutes = configureEmpresasRoutes(
  createEmpresaController,
  getAllEmpresasController,
  getEmpresaByIdController,
  getEmpresaByUsuarioIdController,
  updateEmpresaController,
  deleteEmpresaController
);

const repartidoresRoutes = configureRepartidoresRoutes(
  createRepartidorInfoController,
  updateRepartidorInfoController,
  getRepartidoresDisponiblesController,
  getRepartidorInfoByUsuarioIdController
);

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', categoriasRoutes);
app.use('/api', especificacionesRoutes);
app.use('/api', ordenesRoutes);
app.use('/api', directionRoutes)
app.use('/api', empresasRoutes);
app.use('/api', repartidoresRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Hexagonal Architecture API - Running' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}/api`);
});