import { Request, Response } from 'express';
import { CambiarEstadoOrdenRepartidorUseCase } from '../../application/CambiarEstadoOrdenRepartidorUseCase';

export class CambiarEstadoOrdenRepartidorController {
  constructor(private cambiarEstadoUseCase: CambiarEstadoOrdenRepartidorUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const { estado_orden } = req.body;

      if (!estado_orden) {
        res.status(400).json({ error: 'estado_orden es requerido' });
        return;
      }

      const estadosPermitidos = ['en_camino', 'entregado'];
      if (!estadosPermitidos.includes(estado_orden)) {
        res.status(400).json({ error: 'Estado no permitido. Solo se permite: en_camino, entregado' });
        return;
      }

      const orden = await this.cambiarEstadoUseCase.execute(id, estado_orden);
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
