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
import { authController, createUserController, getAllUsersController, getUserByIdController, updateUserController, deleteUserController, } from './src/users/infrastructure/dependencies';
import { createProductController, getAllProductsController, getProductByIdController, updateProductController, deleteProductController, getProductsByCategoryController } from './src/products/infrastructure/dependencies';
import { createCategoriaController, getAllCategoriasController, getCategoriaByIdController, updateCategoriaController, deleteCategoriaController } from './src/categories/infrastructure/dependencies';
import { createEspecificacionController, getAllEspecificacionesController, getEspecificacionByIdController, getEspecificacionesByProductIdController, updateEspecificacionController, deleteEspecificacionController } from './src/specifications/infrastructure/dependencies';
import { createOrdenController, getAllOrdenesController, getOrdenByIdController, getOrdenesByUsuarioIdController, updateOrdenController, deleteOrdenController } from './src/orders/infrastructure/dependencies';

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
  deleteOrdenController
);

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', categoriasRoutes);
app.use('/api', especificacionesRoutes);
app.use('/api', ordenesRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Hexagonal Architecture API - Running' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}/api`);
});