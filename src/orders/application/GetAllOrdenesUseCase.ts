import { IOrdenRepository } from '../domain/IOrdenRepository';
import { OrdenResponse } from '../domain/dto/OrdenResponse';

export class GetAllOrdenesUseCase {
  constructor(private ordenRepository: IOrdenRepository) {}

  async execute(): Promise<OrdenResponse[]> {
    const ordenes = await this.ordenRepository.getAllOrdenes();
    return ordenes.map(orden => new OrdenResponse(orden));
  }
}
