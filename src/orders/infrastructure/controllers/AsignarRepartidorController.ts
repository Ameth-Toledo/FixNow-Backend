import { Request, Response } from 'express';
import { AsignarRepartidorUseCase } from '../../application/AsignarRepartidorUseCase';

export class AsignarRepartidorController {
  constructor(private asignarRepartidorUseCase: AsignarRepartidorUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const { id_repartidor } = req.body;

      if (!id_repartidor) {
        res.status(400).json({ error: 'id_repartidor es requerido' });
        return;
      }

      const orden = await this.asignarRepartidorUseCase.execute(id, id_repartidor);
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
