import { Request, Response } from 'express';
import { GetOrdenesListasParaRecoleccionUseCase } from '../../application/GetOrdenesListasParaRecoleccionUseCase';

export class GetOrdenesListasParaRecoleccionController {
  constructor(private getOrdenesListasUseCase: GetOrdenesListasParaRecoleccionUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const ordenes = await this.getOrdenesListasUseCase.execute();
      res.status(200).json(ordenes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
