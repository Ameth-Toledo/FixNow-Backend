import { IRepartidorInfoRepository } from '../domain/IRepartidorInfoRepository';
import { RepartidorInfoRequest } from '../domain/dto/RepartidorInfoRequest';
import { RepartidorInfoResponse } from '../domain/dto/RepartidorInfoResponse';

export class CreateRepartidorInfoUseCase {
  constructor(private repository: IRepartidorInfoRepository) {}

  async execute(data: RepartidorInfoRequest): Promise<RepartidorInfoResponse> {
    if (!data.id_usuario || data.id_usuario <= 0) {
      throw new Error('ID de usuario es obligatorio y debe ser válido');
    }

    if (!data.vehiculo) {
      throw new Error('El tipo de vehículo es obligatorio');
    }

    const info = await this.repository.create(data);
    return new RepartidorInfoResponse(info);
  }
}
