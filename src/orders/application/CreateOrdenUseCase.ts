import { IOrdenRepository } from '../domain/IOrdenRepository';
import { OrdenRequest } from '../domain/dto/OrdenRequest';
import { OrdenResponse } from '../domain/dto/OrdenResponse';
import { OrdenNotificationService } from './OrdenNotificationService';

export class CreateOrdenUseCase {
  constructor(private ordenRepository: IOrdenRepository) {}

  async execute(data: OrdenRequest): Promise<OrdenResponse> {
    if (!data.id_usuario || data.id_usuario <= 0) {
      throw new Error('El ID del usuario es obligatorio y debe ser válido');
    }

    if (data.monto_total <= 0) {
      throw new Error('El monto total debe ser mayor a 0');
    }

    if (!data.estado_orden) {
      throw new Error('El estado de la orden es obligatorio');
    }

    // Crear orden en BD
    const orden = await this.ordenRepository.createOrden(data);

    // 🔥 ENVIAR MENSAJE A MQTT
    console.log(`\n📡 Notificando al servidor MQTT`);
    await OrdenNotificationService.notificarNuevaOrden(orden);

    return new OrdenResponse(orden);
  }
}
