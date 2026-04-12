import { IAsesoriaRepository } from '../domain/IAsesoriaRepository';
import { IPayPalService } from '../../paypal/domain/IPayPalService';
import { IChatRepository } from '../../chat/domain/IChatRepository';

export class ConfirmarPagoAsesoriaUseCase {
  constructor(
    private repo: IAsesoriaRepository,
    private paypal: IPayPalService,
    private chatRepo: IChatRepository
  ) {}

  async execute(paypal_order_id: string): Promise<{ id_conversacion: number }> {
    // 1. Buscar el pago pendiente
    const pago = await this.repo.getPagoByOrderId(paypal_order_id);
    if (!pago) throw new Error('Pago no encontrado');

    // 2. Idempotencia: si ya fue procesado, retornar el dato existente
    if (pago.estado === 'completado') {
      if (!pago.id_conversacion) throw new Error('Error interno: pago completado sin conversación asociada');
      return { id_conversacion: pago.id_conversacion };
    }

    if (pago.estado !== 'pendiente') throw new Error('El pago no está en estado pendiente');

    // 3. Capturar el pago en PayPal
    const capture = await this.paypal.captureOrder(paypal_order_id);
    if (capture.status !== 'COMPLETED') {
      throw new Error(`PayPal no confirmó el pago (estado: ${capture.status})`);
    }

    // 4. Crear la conversación entre el usuario y la empresa
    const conv = await this.chatRepo.crearConversacion({
      id_usuario: pago.id_usuario,
      id_empresa: pago.id_empresa,
      tipo: 'usuario_empresa',
    });

    // 5. Confirmar el pago en DB: estado → completado, vincula conversación, activa 30 días
    await this.repo.confirmarPago(paypal_order_id, conv.id_conversacion);

    // 6. Acreditar el 80% al wallet de la empresa
    await this.repo.acreditarWallet(pago.id_empresa, pago.monto_empresa);

    return { id_conversacion: conv.id_conversacion };
  }
}
