import { Request, Response } from 'express';
import { GetOrdenByIdUseCase } from '../../application/GetOrdenByIdUseCase';

export class GetOrdenByIdController {
  constructor(private getOrdenByIdUseCase: GetOrdenByIdUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const orden = await this.getOrdenByIdUseCase.execute(id);
      if (!orden) {
        res.status(404).json({ error: 'Orden not found' });
        return;
      }
      res.status(200).json(orden);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
