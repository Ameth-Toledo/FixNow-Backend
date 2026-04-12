import { ISuscripcionRepository } from '../domain/ISuscripcionRepository';
import { Suscripcion } from '../domain/entities/Suscripcion';

export class ActivarSuscripcionUseCase {
  constructor(private repo: ISuscripcionRepository) {}

  async execute(paypal_subscription_id: string): Promise<Suscripcion> {
    const suscripcion = await this.repo.getSuscripcionByPayPalId(paypal_subscription_id);
    if (!suscripcion) throw new Error('Suscripción no encontrada');

    await this.repo.activarSuscripcion(paypal_subscription_id);

    const actualizada = await this.repo.getSuscripcionByPayPalId(paypal_subscription_id);
    return actualizada!;
  }
}
