import { IOrdenRepository } from '../domain/IOrdenRepository';

export class DeleteOrdenUseCase {
  constructor(private ordenRepository: IOrdenRepository) {}

  async execute(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error('ID de orden inválido');
    }

    return await this.ordenRepository.deleteOrden(id);
  }
}
