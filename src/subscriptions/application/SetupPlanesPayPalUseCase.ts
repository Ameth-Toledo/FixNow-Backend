import { ISuscripcionRepository } from '../domain/ISuscripcionRepository';
import { PayPalSetupService } from '../infrastructure/paypal/PayPalSetupService';
import pool from '../../core/config/conn';

const MONEDA = 'MXN';

export class SetupPlanesPayPalUseCase {
  constructor(
    private repo: ISuscripcionRepository,
    private paypalSetup: PayPalSetupService
  ) {}

  async execute(): Promise<{ productId: string; planes: { nombre: string; paypal_plan_id: string }[] }> {
    const planes = await this.repo.getPlanes();

    if (planes.some(p => p.paypal_plan_id)) {
      throw new Error('Los planes ya tienen paypal_plan_id configurado. Si deseas reconfigurar, limpia la columna primero.');
    }

    // 1. Crear el Producto en PayPal (una sola vez para todos los planes)
    const productId = await this.paypalSetup.crearProducto();
    console.log(`[Setup PayPal] Producto creado: ${productId}`);

    // 2. Crear un Plan en PayPal por cada plan en DB
    const resultado: { nombre: string; paypal_plan_id: string }[] = [];

    for (const plan of planes) {
      const paypalPlanId = await this.paypalSetup.crearPlan({
        productId,
        nombre:      `Voltio ${plan.nombre.charAt(0).toUpperCase() + plan.nombre.slice(1)}`,
        descripcion: plan.descripcion || plan.nombre,
        precio:      plan.precio,
        moneda:      MONEDA,
      });

      // 3. Guardar el paypal_plan_id en DB
      await pool.execute(
        'UPDATE planes SET paypal_plan_id = ? WHERE id_plan = ?',
        [paypalPlanId, plan.id_plan]
      );

      console.log(`[Setup PayPal] Plan "${plan.nombre}" → ${paypalPlanId}`);
      resultado.push({ nombre: plan.nombre, paypal_plan_id: paypalPlanId });
    }

    return { productId, planes: resultado };
  }
}
