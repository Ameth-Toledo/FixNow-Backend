import { Request, Response } from 'express';
import { CapturePayPalOrderUseCase } from '../../application/CapturePayPalOrderUseCase';

export class CapturePayPalOrderController {
  constructor(private capturePayPalOrderUseCase: CapturePayPalOrderUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { orderID } = req.body;

      if (!orderID) {
        res.status(400).json({ error: 'El orderID es obligatorio' });
        return;
      }

      const result = await this.capturePayPalOrderUseCase.execute(orderID);

      res.status(200).json(result);
    } catch (error: any) {
      console.error('❌ Error al capturar orden PayPal:', error.response?.data || error.message);
      res.status(500).json({ error: 'Error al capturar el pago de PayPal' });
    }
  }
}
