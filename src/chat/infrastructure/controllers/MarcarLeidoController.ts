import { Request, Response } from 'express';
import { MarcarLeidoUseCase } from '../../application/MarcarLeidoUseCase';

export class MarcarLeidoController {
  constructor(private marcarLeidoUseCase: MarcarLeidoUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id_conversacion = parseInt(req.params.id_conversacion);
      const { id_usuario } = req.body;
      await this.marcarLeidoUseCase.execute(id_conversacion, id_usuario);
      res.status(200).json({ message: 'Mensajes marcados como leídos' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
