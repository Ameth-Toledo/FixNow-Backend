export interface RepartidorInfoRequest {
  id_usuario: number;
  vehiculo: 'moto' | 'auto' | 'bici';
  placas?: string;
  esta_activo?: boolean;
}

export interface RepartidorInfoUpdateRequest {
  vehiculo?: 'moto' | 'auto' | 'bici';
  placas?: string;
  esta_activo?: boolean;
}
