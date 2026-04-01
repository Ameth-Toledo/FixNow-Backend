import { IOrdenRepository } from '../domain/IOrdenRepository';
import { OrdenResponse } from '../domain/dto/OrdenResponse';
import { OrdenNotificationService } from './OrdenNotificationService';

export class AsignarRepartidorUseCase {
  constructor(private ordenRepository: IOrdenRepository) {}

  async execute(id_orden: number, id_repartidor: number): Promise<OrdenResponse | null> {
    if (!id_orden || id_orden <= 0) {
      throw new Error('ID de orden inválido');
    }

    if (!id_repartidor || id_repartidor <= 0) {
      throw new Error('ID de repartidor inválido');
    }

    const orden = await this.ordenRepository.asignarRepartidor(id_orden, id_repartidor);

    if (!orden) {
      return null;
    }

    await OrdenNotificationService.notificarOrdenAsignada(orden, id_repartidor);

    return new OrdenResponse(orden);
  }
}
