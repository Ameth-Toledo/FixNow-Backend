import { Request, Response } from 'express';
import { GetRepartidoresDisponiblesUseCase } from '../../application/GetRepartidoresDisponiblesUseCase';

export class GetRepartidoresDisponiblesController {
  constructor(private useCase: GetRepartidoresDisponiblesUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const repartidores = await this.useCase.execute();
      res.status(200).json(repartidores);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
