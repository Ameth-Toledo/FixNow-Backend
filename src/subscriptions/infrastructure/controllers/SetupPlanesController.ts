import { Request, Response } from 'express';
import { SetupPlanesPayPalUseCase } from '../../application/SetupPlanesPayPalUseCase';

export class SetupPlanesController {
  constructor(private useCase: SetupPlanesPayPalUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const resultado = await this.useCase.execute();
      res.status(201).json({
        message: 'Planes creados correctamente en PayPal y guardados en DB',
        ...resultado,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
