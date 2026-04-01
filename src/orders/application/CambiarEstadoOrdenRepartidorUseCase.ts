import { IOrdenRepository } from '../domain/IOrdenRepository';
import { OrdenResponse } from '../domain/dto/OrdenResponse';
import { OrdenNotificationService } from './OrdenNotificationService';

export class CambiarEstadoOrdenRepartidorUseCase {
  constructor(private ordenRepository: IOrdenRepository) {}

  async execute(id_orden: number, estado: 'en_camino' | 'entregado'): Promise<OrdenResponse | null> {
    if (!id_orden || id_orden <= 0) {
      throw new Error('ID de orden inválido');
    }

    const estadosPermitidos = ['en_camino', 'entregado'];
    if (!estadosPermitidos.includes(estado)) {
      throw new Error('Estado no permitido. Solo se permite: en_camino, entregado');
    }

    const orden = await this.ordenRepository.updateOrden(id_orden, { estado_orden: estado });

    if (!orden) {
      return null;
    }

    await OrdenNotificationService.notificarCambioEstadoRepartidor(orden);

    return new OrdenResponse(orden);
  }
}
