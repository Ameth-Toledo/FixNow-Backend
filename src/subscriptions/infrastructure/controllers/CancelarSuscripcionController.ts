import { Request, Response } from 'express';
import { CancelarSuscripcionUseCase } from '../../application/CancelarSuscripcionUseCase';

export class CancelarSuscripcionController {
  constructor(private useCase: CancelarSuscripcionUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id_usuario = req.userId!;
      await this.useCase.execute(id_usuario);
      res.json({ message: 'Suscripción cancelada correctamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
