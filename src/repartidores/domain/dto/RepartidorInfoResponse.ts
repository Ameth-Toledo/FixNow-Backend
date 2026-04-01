import { RepartidorInfo } from '../entities/RepartidorInfo';

export class RepartidorInfoResponse {
  id: number;
  id_usuario: number;
  vehiculo: string;
  placas: string | null;
  esta_activo: boolean;
  created_at: Date;

  constructor(info: RepartidorInfo) {
    this.id = info.id;
    this.id_usuario = info.id_usuario;
    this.vehiculo = info.vehiculo;
    this.placas = info.placas;
    this.esta_activo = info.esta_activo;
    this.created_at = info.created_at;
  }
}

export interface RepartidorDisponibleResponse {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string | null;
  image_profile: string | null;
  vehiculo: string;
  placas: string | null;
  esta_activo: boolean;
}
