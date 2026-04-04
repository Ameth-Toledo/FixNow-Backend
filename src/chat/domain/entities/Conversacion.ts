export interface Conversacion {
  id_conversacion: number;
  id_usuario: number;
  nombre_usuario?: string;
  id_empresa?: number | null;
  nombre_empresa?: string | null;
  id_repartidor?: number | null;
  nombre_repartidor?: string | null;
  tipo: 'usuario_empresa' | 'usuario_repartidor';
  ultimo_mensaje?: string | null;
  created_at: Date;
}
