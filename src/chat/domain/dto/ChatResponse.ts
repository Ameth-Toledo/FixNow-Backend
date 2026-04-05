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
  ultimo_mensaje_fecha?: Date | null;
  no_leidos: number;
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
    this.ultimo_mensaje_fecha = conv.ultimo_mensaje_fecha;
    this.no_leidos = conv.no_leidos ?? 0;
    this.created_at = conv.created_at;
  }
}

export class MensajeResponse {
  id_mensaje: number;
  id_conversacion: number;
  id_remitente: number;
  nombre_remitente?: string;
  contenido: string | null;
  tipo_mensaje: 'texto' | 'imagen' | 'video' | 'archivo';
  archivo_url: string | null;
  leido: boolean;
  created_at: Date;
  id_mensaje_reply?: number | null;
  reply_contenido?: string | null;
  reply_nombre_remitente?: string | null;
  reply_tipo_mensaje?: string | null;
  reply_archivo_url?: string | null;

  constructor(msg: Mensaje) {
    this.id_mensaje = msg.id_mensaje;
    this.id_conversacion = msg.id_conversacion;
    this.id_remitente = msg.id_remitente;
    this.nombre_remitente = msg.nombre_remitente;
    this.contenido = msg.contenido;
    this.tipo_mensaje = msg.tipo_mensaje;
    this.archivo_url = msg.archivo_url;
    this.leido = msg.leido;
    this.created_at = msg.created_at;
    this.id_mensaje_reply = msg.id_mensaje_reply;
    this.reply_contenido = msg.reply_contenido;
    this.reply_nombre_remitente = msg.reply_nombre_remitente;
    this.reply_tipo_mensaje = msg.reply_tipo_mensaje;
    this.reply_archivo_url = msg.reply_archivo_url;
  }
}
