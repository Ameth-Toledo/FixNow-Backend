import { Conversacion } from './entities/Conversacion';
import { Mensaje } from './entities/Mensaje';
import { CrearConversacionRequest, EnviarMensajeRequest } from './dto/ChatRequest';

export interface IChatRepository {
  crearConversacion(data: CrearConversacionRequest): Promise<Conversacion>;
  getConversacionById(id: number): Promise<Conversacion | null>;
  getConversacionesByUsuarioId(id_usuario: number): Promise<Conversacion[]>;
  getConversacionesByEmpresaId(id_empresa: number): Promise<Conversacion[]>;
  getConversacionesByRepartidorId(id_repartidor: number): Promise<Conversacion[]>;
  enviarMensaje(data: EnviarMensajeRequest): Promise<Mensaje>;
  getMensajesByConversacionId(id_conversacion: number): Promise<Mensaje[]>;
  marcarMensajesLeidos(id_conversacion: number, id_usuario: number): Promise<void>;
}
