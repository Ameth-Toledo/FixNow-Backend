import { MySQLChatRepository } from './adapters/MySQLChatRepository';
import { CrearConversacionUseCase } from '../application/CrearConversacionUseCase';
import { GetConversacionesUseCase } from '../application/GetConversacionesUseCase';
import { GetMensajesUseCase } from '../application/GetMensajesUseCase';
import { MarcarLeidoUseCase } from '../application/MarcarLeidoUseCase';
import { EnviarMensajeUseCase } from '../application/EnviarMensajeUseCase';
import { CrearConversacionController } from './controllers/CrearConversacionController';
import { GetConversacionesController } from './controllers/GetConversacionesController';
import { GetMensajesController } from './controllers/GetMensajesController';
import { MarcarLeidoController } from './controllers/MarcarLeidoController';

const chatRepository = new MySQLChatRepository();

const crearConversacionUseCase = new CrearConversacionUseCase(chatRepository);
const getConversacionesUseCase = new GetConversacionesUseCase(chatRepository);
const getMensajesUseCase = new GetMensajesUseCase(chatRepository);
const marcarLeidoUseCase = new MarcarLeidoUseCase(chatRepository);

// Exportado para usarlo en el socket handler desde main.ts
export const enviarMensajeUseCase = new EnviarMensajeUseCase(chatRepository);
export const marcarLeidoUseCaseSocket = marcarLeidoUseCase;

export const crearConversacionController = new CrearConversacionController(crearConversacionUseCase);
export const getConversacionesController = new GetConversacionesController(getConversacionesUseCase);
export const getMensajesController = new GetMensajesController(getMensajesUseCase);
export const marcarLeidoController = new MarcarLeidoController(marcarLeidoUseCase);
