import { Request, Response } from 'express';
import { ActivarSuscripcionUseCase } from '../../application/ActivarSuscripcionUseCase';

export class RetornoPayPalController {
  constructor(private useCase: ActivarSuscripcionUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const subscription_id = req.query.subscription_id as string;

      if (!subscription_id) {
        res.status(400).json({ error: 'subscription_id no recibido' });
        return;
      }

      await this.useCase.execute(subscription_id);

      // Redirigir a la app con deep link
      const deepLink = process.env.APP_DEEP_LINK || 'voltio://suscripcion/success';
      res.redirect(`${deepLink}?subscription_id=${subscription_id}`);
    } catch (error: any) {
      const deepLink = process.env.APP_DEEP_LINK || 'voltio://suscripcion/error';
      res.redirect(`${deepLink}?error=${encodeURIComponent(error.message)}`);
    }
  }
}
