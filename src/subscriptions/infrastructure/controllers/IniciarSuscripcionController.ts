import { Request, Response } from 'express';
import { IniciarSuscripcionUseCase } from '../../application/IniciarSuscripcionUseCase';

export class IniciarSuscripcionController {
  constructor(private useCase: IniciarSuscripcionUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id_usuario = req.userId!;
      const id_plan    = parseInt(String(req.body.id_plan));

      if (!id_plan) {
        res.status(400).json({ error: 'id_plan es requerido' });
        return;
      }

      const result = await this.useCase.execute(id_usuario, id_plan);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
