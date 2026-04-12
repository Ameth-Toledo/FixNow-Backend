import { ISuscripcionRepository } from '../domain/ISuscripcionRepository';

const DIAS_GRACIA = 5;

export class ProcesarWebhookUseCase {
  constructor(private repo: ISuscripcionRepository) {}

  async execute(event_type: string, resource: { id: string }): Promise<void> {
    const paypal_subscription_id = resource.id;

    switch (event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        await this.repo.activarSuscripcion(paypal_subscription_id);
        break;
      }

      case 'PAYMENT.SALE.COMPLETED': {
        // Renovación exitosa — activar y extender fechas
        await this.repo.activarSuscripcion(paypal_subscription_id);
        break;
      }

      case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED': {
        const suscripcion = await this.repo.getSuscripcionByPayPalId(paypal_subscription_id);
        if (suscripcion) {
          await this.repo.actualizarEstado(suscripcion.id_suscripcion, 'gracia');
        }
        break;
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        const suscripcion = await this.repo.getSuscripcionByPayPalId(paypal_subscription_id);
        if (suscripcion) {
          const nuevoEstado = event_type === 'BILLING.SUBSCRIPTION.CANCELLED' ? 'cancelada' : 'vencida';
          await this.repo.actualizarEstado(suscripcion.id_suscripcion, nuevoEstado);
        }
        break;
      }

      default:
        // Evento no manejado — ignorar
        break;
    }
  }
}
