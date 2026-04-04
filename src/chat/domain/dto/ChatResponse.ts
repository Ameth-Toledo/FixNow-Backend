import { Conversacion } from '../entities/Conversacion';
import { Mensaje } from '../entities/Mensaje';

export class ConversacionResponse {
  id_conversacion: number;
  id_usuario: number;
  nombre_usuario?: string;
  id_empresa?: number | null;
  nombre_empresa?: string | null;
  id_repartidor?: number | null;
  nombre_repartidor?: string | null;
  tipo: string;
  ultimo_mensaje?: string | null;
  created_at: Date;

  constructor(conv: Conversacion) {
    this.id_conversacion = conv.id_conversacion;
    this.id_usuario = conv.id_usuario;
    this.nombre_usuario = conv.nombre_usuario;
    this.id_empresa = conv.id_empresa;
    this.nombre_empresa = conv.nombre_empresa;
    this.id_repartidor = conv.id_repartidor;
    this.nombre_repartidor = conv.nombre_repartidor;
    this.tipo = conv.tipo;
    this.ultimo_mensaje = conv.ultimo_mensaje;
    this.created_at = conv.created_at;
  }
}

export class MensajeResponse {
  id_mensaje: number;
  id_conversacion: number;
  id_remitente: number;
  nombre_remitente?: string;
  contenido: string;
  leido: boolean;
  created_at: Date;

  constructor(msg: Mensaje) {
    this.id_mensaje = msg.id_mensaje;
    this.id_conversacion = msg.id_conversacion;
    this.id_remitente = msg.id_remitente;
    this.nombre_remitente = msg.nombre_remitente;
    this.contenido = msg.contenido;
    this.leido = msg.leido;
    this.created_at = msg.created_at;
  }
}
