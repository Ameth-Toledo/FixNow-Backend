import { IRepartidorInfoRepository } from '../domain/IRepartidorInfoRepository';
import { RepartidorInfoResponse } from '../domain/dto/RepartidorInfoResponse';

export class GetRepartidorInfoByUsuarioIdUseCase {
  constructor(private repository: IRepartidorInfoRepository) {}

  async execute(id_usuario: number): Promise<RepartidorInfoResponse | null> {
    if (!id_usuario || id_usuario <= 0) {
      throw new Error('ID de usuario inválido');
    }

    const info = await this.repository.getByUsuarioId(id_usuario);
    return info ? new RepartidorInfoResponse(info) : null;
  }
}
