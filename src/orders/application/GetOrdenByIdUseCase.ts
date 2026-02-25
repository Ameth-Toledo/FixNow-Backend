import { IOrdenRepository } from '../domain/IOrdenRepository';
import { OrdenResponse } from '../domain/dto/OrdenResponse';

export class GetOrdenByIdUseCase {
  constructor(private ordenRepository: IOrdenRepository) {}

  async execute(id: number): Promise<OrdenResponse | null> {
    if (!id || id <= 0) {
      throw new Error('ID de orden inválido');
    }

    const orden = await this.ordenRepository.getOrdenById(id);
    return orden ? new OrdenResponse(orden) : null;
  }
}
