export interface RepartidorInfo {
  id: number;
  id_usuario: number;
  vehiculo: 'moto' | 'auto' | 'bici';
  placas: string | null;
  esta_activo: boolean;
  created_at: Date;
}
