import { Request, Response } from 'express';
import { UpdateOrdenUseCase } from '../../application/UpdateOrdenUseCase';
import { OrdenUpdateRequest } from '../../domain/dto/OrdenRequest';

export class UpdateOrdenController {
  constructor(private updateOrdenUseCase: UpdateOrdenUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const data: OrdenUpdateRequest = req.body;
      const orden = await this.updateOrdenUseCase.execute(id, data);
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
