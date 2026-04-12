import { Request, Response } from 'express';
import { ProcesarWebhookUseCase } from '../../application/ProcesarWebhookUseCase';

export class WebhookController {
  constructor(private useCase: ProcesarWebhookUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { event_type, resource } = req.body;

      if (!event_type || !resource) {
        res.status(400).json({ error: 'Payload inválido' });
        return;
      }

      await this.useCase.execute(event_type, resource);
      res.status(200).json({ received: true });
    } catch (error: any) {
      // Responder 200 siempre para que PayPal no reintente el webhook
      console.error('Error procesando webhook PayPal:', error.message);
      res.status(200).json({ received: true });
    }
  }
}
