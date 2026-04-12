import { MySQLAsesoriaRepository } from './adapters/MySQLAsesoriaRepository';
import { PayPalServiceAdapter } from '../../paypal/infrastructure/adapters/PayPalServiceAdapter';
import { MySQLChatRepository } from '../../chat/infrastructure/adapters/MySQLChatRepository';

import { ConfigurarAsesoriaUseCase } from '../application/ConfigurarAsesoriaUseCase';
import { IniciarPagoAsesoriaUseCase } from '../application/IniciarPagoAsesoriaUseCase';
import { ConfirmarPagoAsesoriaUseCase } from '../application/ConfirmarPagoAsesoriaUseCase';
import { GetAccesoAsesoriaUseCase } from '../application/GetAccesoAsesoriaUseCase';

import { ConfigurarAsesoriaController } from './controllers/ConfigurarAsesoriaController';
import { IniciarPagoAsesoriaController } from './controllers/IniciarPagoAsesoriaController';
import { ConfirmarPagoAsesoriaController } from './controllers/ConfirmarPagoAsesoriaController';
import { GetAccesoAsesoriaController } from './controllers/GetAccesoAsesoriaController';

// Repositorios e infraestructura
const asesoriaRepository = new MySQLAsesoriaRepository();
const paypalService       = new PayPalServiceAdapter();
const chatRepository      = new MySQLChatRepository();

// Casos de uso
const configurarUseCase    = new ConfigurarAsesoriaUseCase(asesoriaRepository);
const iniciarPagoUseCase   = new IniciarPagoAsesoriaUseCase(asesoriaRepository, paypalService);
const confirmarPagoUseCase = new ConfirmarPagoAsesoriaUseCase(asesoriaRepository, paypalService, chatRepository);
const getAccesoUseCase     = new GetAccesoAsesoriaUseCase(asesoriaRepository);

// Controladores
export const configurarAsesoriaController    = new ConfigurarAsesoriaController(configurarUseCase);
export const iniciarPagoAsesoriaController   = new IniciarPagoAsesoriaController(iniciarPagoUseCase);
export const confirmarPagoAsesoriaController = new ConfirmarPagoAsesoriaController(confirmarPagoUseCase);
export const getAccesoAsesoriaController     = new GetAccesoAsesoriaController(getAccesoUseCase);
