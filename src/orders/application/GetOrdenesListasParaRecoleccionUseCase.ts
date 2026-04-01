import { IOrdenRepository } from '../domain/IOrdenRepository';
import { OrdenResponse } from '../domain/dto/OrdenResponse';

export class GetOrdenesListasParaRecoleccionUseCase {
  constructor(private ordenRepository: IOrdenRepository) {}

  async execute(): Promise<OrdenResponse[]> {
    const ordenes = await this.ordenRepository.getOrdenesListasParaRecoleccion();
    return ordenes.map(orden => new OrdenResponse(orden));
  }
}
