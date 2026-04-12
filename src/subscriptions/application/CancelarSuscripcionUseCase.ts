import { ISuscripcionRepository } from '../domain/ISuscripcionRepository';
import { IPayPalSubscriptionService } from '../domain/IPayPalSubscriptionService';

export class CancelarSuscripcionUseCase {
  constructor(
    private repo: ISuscripcionRepository,
    private paypal: IPayPalSubscriptionService
  ) {}

  async execute(id_usuario: number): Promise<void> {
    const suscripcion = await this.repo.getSuscripcionActivaByUsuarioId(id_usuario);
    if (!suscripcion) throw new Error('No tienes una suscripción activa');

    if (suscripcion.paypal_subscription_id) {
      await this.paypal.cancelSubscription(suscripcion.paypal_subscription_id, 'Cancelado por el usuario');
    }

    await this.repo.cancelarSuscripcion(id_usuario);
  }
}
