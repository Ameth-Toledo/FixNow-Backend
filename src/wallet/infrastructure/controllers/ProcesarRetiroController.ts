import { Request, Response } from 'express';
import { ProcesarRetiroUseCase } from '../../application/ProcesarRetiroUseCase';
import { EstadoRetiro } from '../../domain/entities/Retiro';

export class ProcesarRetiroController {
  constructor(private useCase: ProcesarRetiroUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id_retiro  = parseInt(String(req.params.id_retiro));
      const { estado, notas_admin } = req.body;

      if (!id_retiro || !estado) {
        res.status(400).json({ error: 'id_retiro y estado son requeridos' });
        return;
      }

      await this.useCase.execute(id_retiro, estado as EstadoRetiro, notas_admin);
      res.json({ message: `Retiro ${id_retiro} marcado como ${estado}` });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
