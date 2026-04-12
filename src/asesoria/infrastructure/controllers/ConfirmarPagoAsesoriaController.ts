import { Request, Response } from 'express';
import { ConfirmarPagoAsesoriaUseCase } from '../../application/ConfirmarPagoAsesoriaUseCase';

export class ConfirmarPagoAsesoriaController {
  constructor(private useCase: ConfirmarPagoAsesoriaUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      // PayPal envía el orderId como query param "token" en el return URL
      const token = req.query.token as string;

      if (!token) {
        res.status(400).json({ error: 'Token de orden no encontrado en la URL' });
        return;
      }

      const result = await this.useCase.execute(token);

      // Redirigir directamente al chat con la conversación recién creada
      const deepLink = process.env.APP_DEEP_LINK || 'http://localhost:4200/dashboard/chat';
      res.redirect(`${deepLink}?id_conversacion=${result.id_conversacion}`);
    } catch (error: any) {
      console.error('Error al confirmar pago asesoría:', error.message);
      const deepLink = process.env.APP_DEEP_LINK || 'http://localhost:4200/dashboard/chat';
      res.redirect(`${deepLink}?error=${encodeURIComponent(error.message)}`);
    }
  }
}
