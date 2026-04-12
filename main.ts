import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
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
import { configureChatRoutes } from './src/chat/infrastructure/routes/routes';
import { authController, createUserController, registerCompanyController, googleRegisterCompanyController, getAllUsersController, getUserByIdController, updateUserController, deleteUserController, changePasswordController } from './src/users/infrastructure/dependencies';
import { createProductController, getAllProductsController, getProductByIdController, updateProductController, deleteProductController, getProductsByCategoryController, getProductsByEmpresaController } from './src/products/infrastructure/dependencies';
import { createCategoriaController, getAllCategoriasController, getCategoriaByIdController, updateCategoriaController, deleteCategoriaController } from './src/categories/infrastructure/dependencies';
import { createEspecificacionController, getAllEspecificacionesController, getEspecificacionByIdController, getEspecificacionesByProductIdController, updateEspecificacionController, deleteEspecificacionController } from './src/specifications/infrastructure/dependencies';
import { createOrdenController, getAllOrdenesController, getOrdenByIdController, getOrdenesByUsuarioIdController, updateOrdenController, deleteOrdenController, asignarRepartidorController, getOrdenesListasParaRecoleccionController, getOrdenesByRepartidorIdController, cambiarEstadoOrdenRepartidorController, getOrdenesByEmpresaIdController } from './src/orders/infrastructure/dependencies';
import { createEmpresaController, getAllEmpresasController, getEmpresaByIdController, getEmpresaByUsuarioIdController, updateEmpresaController, deleteEmpresaController } from './src/empresas/infrastructure/dependencies';
import { createRepartidorInfoController, updateRepartidorInfoController, getRepartidoresDisponiblesController, getRepartidorInfoByUsuarioIdController } from './src/repartidores/infrastructure/dependencies';
import { configureDirectionRoutes } from './src/directions/infrastructure/routes/routes'
import { createDirectionController, getAllDirectionController, getDirectionByIdController, getDirectionsByUserIdController, updateDirectionController, deleteDirectionController } from './src/directions/infrastructure/dependencies'
import { configurePayPalRoutes } from './src/paypal/infrastructure/routes/routes';
import { createPayPalOrderController, capturePayPalOrderController } from './src/paypal/infrastructure/dependencies';
import { configureSuscripcionesRoutes } from './src/subscriptions/infrastructure/routes/routes';
import { getPlanesController, iniciarSuscripcionController, retornoPayPalController, webhookController, getEstadoController, cancelarSuscripcionController, setupPlanesController, actualizarVencimientosUseCase } from './src/subscriptions/infrastructure/dependencies';
import { configureAsesoriaRoutes } from './src/asesoria/infrastructure/routes/routes';
import { configurarAsesoriaController, iniciarPagoAsesoriaController, confirmarPagoAsesoriaController, getAccesoAsesoriaController } from './src/asesoria/infrastructure/dependencies';
import { configureWalletRoutes } from './src/wallet/infrastructure/routes/routes';
import { getWalletController, solicitarRetiroController, getRetirosController, procesarRetiroController } from './src/wallet/infrastructure/dependencies';
import { configureBannerRoutes } from './src/banners/infrastructure/routes/routes';
import { createBannerController, getBannersByEmpresaController, toggleBannerController, deleteBannerController } from './src/banners/infrastructure/dependencies';
import { iniciarCronSuscripciones } from './src/subscriptions/infrastructure/cron/SuscripcionCronJob';
import { crearConversacionController, getConversacionesController, getMensajesController, marcarLeidoController, enviarMensajeUseCase, marcarLeidoUseCaseSocket, createSubirArchivoController, chatRepository } from './src/chat/infrastructure/dependencies';
import { ChatSocketHandler } from './src/chat/infrastructure/socket/ChatSocketHandler';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      callback(null, origin || true);
    },
    credentials: true,
  },
});

InitCloudinary();

app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin || true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
  deleteUserController,
  changePasswordController
);

const productRoutes = configureProductRoutes(
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  getProductsByCategoryController,
  getProductsByEmpresaController
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
  cambiarEstadoOrdenRepartidorController,
  getOrdenesByEmpresaIdController
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

const paypalRoutes = configurePayPalRoutes(
  createPayPalOrderController,
  capturePayPalOrderController
);

const suscripcionesRoutes = configureSuscripcionesRoutes(
  getPlanesController,
  iniciarSuscripcionController,
  retornoPayPalController,
  webhookController,
  getEstadoController,
  cancelarSuscripcionController,
  setupPlanesController
);

const chatRoutes = configureChatRoutes(
  crearConversacionController,
  getConversacionesController,
  getMensajesController,
  marcarLeidoController,
  createSubirArchivoController(io)
);

const asesoriaRoutes = configureAsesoriaRoutes(
  configurarAsesoriaController,
  iniciarPagoAsesoriaController,
  confirmarPagoAsesoriaController,
  getAccesoAsesoriaController
);

const walletRoutes = configureWalletRoutes(
  getWalletController,
  solicitarRetiroController,
  getRetirosController,
  procesarRetiroController
);

const bannerRoutes = configureBannerRoutes(
  createBannerController,
  getBannersByEmpresaController,
  toggleBannerController,
  deleteBannerController
);

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', categoriasRoutes);
app.use('/api', especificacionesRoutes);
app.use('/api', ordenesRoutes);
app.use('/api', directionRoutes)
app.use('/api', empresasRoutes);
app.use('/api', repartidoresRoutes);
app.use('/api', paypalRoutes);
app.use('/api', suscripcionesRoutes);
app.use('/api', chatRoutes);
app.use('/api', asesoriaRoutes);
app.use('/api', walletRoutes);
app.use('/api', bannerRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Hexagonal Architecture API - Running' });
});

// Inicializar cron de suscripciones
iniciarCronSuscripciones(actualizarVencimientosUseCase);

// Inicializar socket handler del chat
const chatSocketHandler = new ChatSocketHandler(io, enviarMensajeUseCase, marcarLeidoUseCaseSocket, chatRepository);
chatSocketHandler.init();

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}/api`);
  console.log(`Socket.io listo para conexiones`);
});
