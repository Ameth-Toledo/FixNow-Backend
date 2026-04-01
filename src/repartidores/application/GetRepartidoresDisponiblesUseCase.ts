import { IRepartidorInfoRepository } from '../domain/IRepartidorInfoRepository';
import { RepartidorDisponibleResponse } from '../domain/dto/RepartidorInfoResponse';

export class GetRepartidoresDisponiblesUseCase {
  constructor(private repository: IRepartidorInfoRepository) {}

  async execute(): Promise<RepartidorDisponibleResponse[]> {
    return await this.repository.getDisponibles();
  }
}
