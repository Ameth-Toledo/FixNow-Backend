export type EstadoPago = 'pendiente' | 'completado' | 'reembolsado';

export interface PagoAsesoria {
  id_pago: number;
  id_usuario: number;
  id_empresa: number;
  id_conversacion: number | null;
  paypal_order_id: string;
  monto_total: number;
  monto_empresa: number;   // 80%
  monto_app: number;       // 20%
  estado: EstadoPago;
  fecha_expiracion: Date | null;
  created_at: Date;
}
