import { IOrdenRepository } from '../domain/IOrdenRepository';
import { OrdenUpdateRequest } from '../domain/dto/OrdenRequest';
import { OrdenResponse } from '../domain/dto/OrdenResponse';
import { OrdenNotificationService } from './OrdenNotificationService';

export class UpdateOrdenUseCase {
  constructor(private ordenRepository: IOrdenRepository) {}

  async execute(id: number, data: OrdenUpdateRequest): Promise<OrdenResponse | null> {
    if (!id || id <= 0) {
      throw new Error('ID de orden inválido');
    }

    if (data.monto_total !== undefined && data.monto_total <= 0) {
      throw new Error('El monto total debe ser mayor a 0');
    }

    const orden = await this.ordenRepository.updateOrden(id, data);
    
    if (!orden) {
      return null;
    }

    console.log(`\n📡 Notificando actualización al servidor MQTT`);
    await OrdenNotificationService.notificarActualizacionOrden(orden);

    return new OrdenResponse(orden);
  }
}
