import { Request, Response } from 'express';
import { GetOrdenesByRepartidorIdUseCase } from '../../application/GetOrdenesByRepartidorIdUseCase';

export class GetOrdenesByRepartidorIdController {
  constructor(private getOrdenesByRepartidorIdUseCase: GetOrdenesByRepartidorIdUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id_repartidor = parseInt(req.params.id_repartidor as string, 10);
      const ordenes = await this.getOrdenesByRepartidorIdUseCase.execute(id_repartidor);
      res.status(200).json(ordenes);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
