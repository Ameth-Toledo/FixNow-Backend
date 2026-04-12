import { Request, Response } from 'express';
import { ConfigurarAsesoriaUseCase } from '../../application/ConfigurarAsesoriaUseCase';

export class ConfigurarAsesoriaController {
  constructor(private useCase: ConfigurarAsesoriaUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id_empresa = parseInt(String(req.body.id_empresa));
      const { precio, activa } = req.body;

      if (!id_empresa || precio === undefined || activa === undefined) {
        res.status(400).json({ error: 'id_empresa, precio y activa son requeridos' });
        return;
      }

      await this.useCase.execute(id_empresa, Number(precio), Boolean(activa));
      res.json({ message: 'Configuración de asesoría actualizada correctamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
