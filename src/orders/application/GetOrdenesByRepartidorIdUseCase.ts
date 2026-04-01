import { IOrdenRepository } from '../domain/IOrdenRepository';
import { OrdenResponse } from '../domain/dto/OrdenResponse';

export class GetOrdenesByRepartidorIdUseCase {
  constructor(private ordenRepository: IOrdenRepository) {}

  async execute(id_repartidor: number): Promise<OrdenResponse[]> {
    if (!id_repartidor || id_repartidor <= 0) {
      throw new Error('ID de repartidor inválido');
    }

    const ordenes = await this.ordenRepository.getOrdenesByRepartidorId(id_repartidor);
    return ordenes.map(orden => new OrdenResponse(orden));
  }
}
