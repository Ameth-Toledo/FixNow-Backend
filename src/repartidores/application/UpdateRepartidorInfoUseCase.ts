import { IRepartidorInfoRepository } from '../domain/IRepartidorInfoRepository';
import { RepartidorInfoUpdateRequest } from '../domain/dto/RepartidorInfoRequest';
import { RepartidorInfoResponse } from '../domain/dto/RepartidorInfoResponse';

export class UpdateRepartidorInfoUseCase {
  constructor(private repository: IRepartidorInfoRepository) {}

  async execute(id_usuario: number, data: RepartidorInfoUpdateRequest): Promise<RepartidorInfoResponse | null> {
    if (!id_usuario || id_usuario <= 0) {
      throw new Error('ID de usuario inválido');
    }

    const info = await this.repository.update(id_usuario, data);
    return info ? new RepartidorInfoResponse(info) : null;
  }
}
