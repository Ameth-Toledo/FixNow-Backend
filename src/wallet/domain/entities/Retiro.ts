export type EstadoRetiro  = 'pendiente' | 'procesado' | 'rechazado';
export type MetodoRetiro  = 'transferencia' | 'paypal';

export interface Retiro {
  id_retiro:    number;
  id_empresa:   number;
  monto:        number;
  metodo:       MetodoRetiro;
  datos_cuenta: Record<string, any>;
  estado:       EstadoRetiro;
  notas_admin:  string | null;
  procesado_at: Date | null;
  created_at:   Date;
}
