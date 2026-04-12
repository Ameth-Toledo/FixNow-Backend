import { ISuscripcionRepository } from '../domain/ISuscripcionRepository';
import { IPayPalSubscriptionService } from '../domain/IPayPalSubscriptionService';

export class IniciarSuscripcionUseCase {
  constructor(
    private repo: ISuscripcionRepository,
    private paypal: IPayPalSubscriptionService
  ) {}

  async execute(id_usuario: number, id_plan: number): Promise<{ approveUrl: string; paypal_subscription_id: string }> {
    const plan = await this.repo.getPlanById(id_plan);
    if (!plan) throw new Error('Plan no encontrado');
    if (!plan.activo) throw new Error('Plan no disponible');
    if (!plan.paypal_plan_id) throw new Error('Plan sin configuración de pago. Contacta al administrador.');

    const suscripcionActiva = await this.repo.getSuscripcionActivaByUsuarioId(id_usuario);
    if (suscripcionActiva && (suscripcionActiva.estado === 'activa' || suscripcionActiva.estado === 'gracia')) {
      throw new Error('Ya tienes una suscripción activa');
    }

    const returnUrl = `${process.env.BACKEND_URL}/api/suscripciones/retorno`;
    const cancelUrl = `${process.env.BACKEND_URL}/api/suscripciones/cancelado`;

    const { id: paypal_subscription_id, approveUrl } = await this.paypal.createSubscription(
      plan.paypal_plan_id,
      returnUrl,
      cancelUrl
    );

    await this.repo.crearSuscripcion({ id_usuario, id_plan, paypal_subscription_id });

    return { approveUrl, paypal_subscription_id };
  }
}
