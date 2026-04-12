import { IAsesoriaRepository } from '../domain/IAsesoriaRepository';
import { IPayPalService } from '../../paypal/domain/IPayPalService';
import pool from '../../core/config/conn';
import { RowDataPacket } from 'mysql2';

const COMISION_APP = 0.20;

export class IniciarPagoAsesoriaUseCase {
  constructor(
    private repo: IAsesoriaRepository,
    private paypal: IPayPalService
  ) {}

  async execute(id_usuario: number, id_empresa: number): Promise<{ approveUrl: string; orderId: string }> {
    // 1. Verificar que la empresa tenga asesoría activa
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT precio_asesoria, asesoria_activa FROM empresas WHERE id_empresa = ?',
      [id_empresa]
    );

    if (!rows.length) throw new Error('Empresa no encontrada');
    const empresa = rows[0];
    if (!empresa.asesoria_activa)  throw new Error('Esta empresa no ofrece asesoría en este momento');
    if (!empresa.precio_asesoria)  throw new Error('La empresa no tiene precio de asesoría configurado');

    // 2. Verificar que el usuario no tenga acceso activo
    const acceso = await this.repo.getAcceso(id_usuario, id_empresa);
    if (acceso.tiene_acceso) throw new Error('Ya tienes un acceso activo a la asesoría de esta empresa');

    const monto_total   = Number(empresa.precio_asesoria);
    const monto_app     = parseFloat((monto_total * COMISION_APP).toFixed(2));
    const monto_empresa = parseFloat((monto_total - monto_app).toFixed(2));

    // 3. Crear orden PayPal con URLs de retorno
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000/api';
    const deepLink   = process.env.APP_DEEP_LINK || 'http://localhost:4200/dashboard';

    const orden = await this.paypal.createOrder(monto_total, 'MXN', {
      returnUrl: `${backendUrl}/asesoria/pago/confirmar`,
      cancelUrl: `${deepLink}/asesoria?cancelado=true`,
    });

    // 4. Registrar pago pendiente en DB
    await this.repo.crearPago({
      id_usuario,
      id_empresa,
      paypal_order_id: orden.id,
      monto_total,
      monto_empresa,
      monto_app,
    });

    // 5. Construir approveUrl (sandbox vs producción)
    const isSandbox  = (process.env.PAYPAL_API_URL || '').includes('sandbox');
    const paypalBase = isSandbox
      ? 'https://www.sandbox.paypal.com'
      : 'https://www.paypal.com';

    const approveUrl = `${paypalBase}/checkoutnow?token=${orden.id}`;

    return { approveUrl, orderId: orden.id };
  }
}
