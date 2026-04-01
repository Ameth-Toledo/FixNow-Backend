import { Request, Response } from 'express';
import { UpdateRepartidorInfoUseCase } from '../../application/UpdateRepartidorInfoUseCase';

export class UpdateRepartidorInfoController {
  constructor(private useCase: UpdateRepartidorInfoUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id_usuario = parseInt(req.params.id_usuario as string, 10);
      const data = req.body;
      const info = await this.useCase.execute(id_usuario, data);
      if (!info) {
        res.status(404).json({ error: 'Repartidor info not found' });
        return;
      }
      res.status(200).json(info);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
