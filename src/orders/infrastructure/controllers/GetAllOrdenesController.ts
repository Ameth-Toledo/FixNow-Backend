import { Request, Response } from 'express';
import { GetAllOrdenesUseCase } from '../../application/GetAllOrdenesUseCase';

export class GetAllOrdenesController {
  constructor(private getAllOrdenesUseCase: GetAllOrdenesUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const ordenes = await this.getAllOrdenesUseCase.execute();
      res.status(200).json(ordenes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
