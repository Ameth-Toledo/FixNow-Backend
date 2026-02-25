import { IOrdenRepository } from '../domain/IOrdenRepository';
import { OrdenResponse } from '../domain/dto/OrdenResponse';

export class GetOrdenesByUsuarioIdUseCase {
  constructor(private ordenRepository: IOrdenRepository) {}

  async execute(id_usuario: number): Promise<OrdenResponse[]> {
    if (!id_usuario || id_usuario <= 0) {
      throw new Error('ID de usuario inválido');
    }

    const ordenes = await this.ordenRepository.getOrdenesByUsuarioId(id_usuario);
    return ordenes.map(orden => new OrdenResponse(orden));
  }
}
