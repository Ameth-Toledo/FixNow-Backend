export type EstadoSuscripcion = 'pendiente' | 'activa' | 'gracia' | 'vencida' | 'cancelada';

export interface Suscripcion {
  id_suscripcion: number;
  id_usuario: number;
  id_plan: number;
  nombre_plan?: string;
  tipo_rol?: string;
  precio_plan?: number;
  paypal_subscription_id: string | null;
  estado: EstadoSuscripcion;
  fecha_inicio: Date | null;
  fecha_vencimiento: Date | null;
  fecha_fin_gracia: Date | null;
  created_at: Date;
  updated_at: Date;
}
