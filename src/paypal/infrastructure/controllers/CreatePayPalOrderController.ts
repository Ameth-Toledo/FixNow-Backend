import { Request, Response } from 'express';
import { CreatePayPalOrderUseCase } from '../../application/CreatePayPalOrderUseCase';

export class CreatePayPalOrderController {
  constructor(private createPayPalOrderUseCase: CreatePayPalOrderUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { monto, currency_code } = req.body;

      if (!monto) {
        res.status(400).json({ error: 'El monto es obligatorio' });
        return;
      }

      const result = await this.createPayPalOrderUseCase.execute(
        Number(monto),
        currency_code || 'MXN'
      );

      res.status(201).json(result);
    } catch (error: any) {
      console.error('❌ Error al crear orden PayPal:', error.response?.data || error.message);
      res.status(500).json({ error: 'Error al crear la orden de PayPal' });
    }
  }
}
