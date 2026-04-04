export interface Mensaje {
  id_mensaje: number;
  id_conversacion: number;
  id_remitente: number;
  nombre_remitente?: string;
  contenido: string;
  leido: boolean;
  created_at: Date;
}
