export interface CrearConversacionRequest {
  id_usuario: number;
  id_empresa?: number;
  id_repartidor?: number;
  tipo: 'usuario_empresa' | 'usuario_repartidor';
}

export interface EnviarMensajeRequest {
  id_conversacion: number;
  id_remitente: number;
  contenido: string | null;
  tipo_mensaje?: 'texto' | 'imagen' | 'video' | 'archivo';
  archivo_url?: string | null;
  id_mensaje_reply?: number | null;
}
