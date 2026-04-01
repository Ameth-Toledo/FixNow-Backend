import { RepartidorInfo } from './entities/RepartidorInfo';
import { RepartidorInfoRequest, RepartidorInfoUpdateRequest } from './dto/RepartidorInfoRequest';
import { RepartidorDisponibleResponse } from './dto/RepartidorInfoResponse';

export interface IRepartidorInfoRepository {
  create(data: RepartidorInfoRequest): Promise<RepartidorInfo>;
  getByUsuarioId(id_usuario: number): Promise<RepartidorInfo | null>;
  update(id_usuario: number, data: RepartidorInfoUpdateRequest): Promise<RepartidorInfo | null>;
  getDisponibles(): Promise<RepartidorDisponibleResponse[]>;
}
