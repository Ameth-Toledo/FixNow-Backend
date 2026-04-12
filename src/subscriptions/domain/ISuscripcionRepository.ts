import { Plan } from './entities/Plan';
import { Suscripcion } from './entities/Suscripcion';

export interface ISuscripcionRepository {
  getPlanes(tipo_rol?: string): Promise<Plan[]>;
  getPlanById(id_plan: number): Promise<Plan | null>;

  crearSuscripcion(data: {
    id_usuario: number;
    id_plan: number;
    paypal_subscription_id: string;
  }): Promise<Suscripcion>;

  getSuscripcionActivaByUsuarioId(id_usuario: number): Promise<Suscripcion | null>;
  getSuscripcionByPayPalId(paypal_subscription_id: string): Promise<Suscripcion | null>;

  activarSuscripcion(paypal_subscription_id: string): Promise<void>;
  actualizarEstado(id_suscripcion: number, estado: string): Promise<void>;
  cancelarSuscripcion(id_usuario: number): Promise<void>;

  // Para el cron job
  getSuscripcionesVencidasSinGracia(): Promise<Suscripcion[]>;
  getSuscripcionesGraciaExpirada(): Promise<Suscripcion[]>;
}
