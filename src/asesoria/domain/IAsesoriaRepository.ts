import { PagoAsesoria } from './entities/PagoAsesoria';
import { AccesoAsesoria } from './entities/AccesoAsesoria';

export interface IAsesoriaRepository {
  // Configuración de la empresa
  configurarAsesoria(id_empresa: number, precio: number, activa: boolean): Promise<void>;

  // Pago
  crearPago(data: {
    id_usuario: number;
    id_empresa: number;
    paypal_order_id: string;
    monto_total: number;
    monto_empresa: number;
    monto_app: number;
  }): Promise<PagoAsesoria>;

  getPagoByOrderId(paypal_order_id: string): Promise<PagoAsesoria | null>;
  confirmarPago(paypal_order_id: string, id_conversacion: number): Promise<void>;

  // Acceso
  getAcceso(id_usuario: number, id_empresa: number): Promise<AccesoAsesoria>;

  // Wallet — acreditar al confirmar pago
  acreditarWallet(id_empresa: number, monto: number): Promise<void>;
}
