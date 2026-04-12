import { Request, Response } from 'express';
import { GetEstadoSuscripcionUseCase } from '../../application/GetEstadoSuscripcionUseCase';

export class GetEstadoController {
  constructor(private useCase: GetEstadoSuscripcionUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id_usuario = parseInt(String(req.params.id_usuario));
      const suscripcion = await this.useCase.execute(id_usuario);

      if (!suscripcion) {
        res.status(404).json({ error: 'Sin suscripción activa' });
        return;
      }

      // Calcular días restantes si está en gracia
      let diasGraciaRestantes: number | null = null;
      if (suscripcion.estado === 'gracia' && suscripcion.fecha_fin_gracia) {
        const ahora = new Date();
        const diff  = new Date(suscripcion.fecha_fin_gracia).getTime() - ahora.getTime();
        diasGraciaRestantes = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      }

      res.json({ ...suscripcion, dias_gracia_restantes: diasGraciaRestantes });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
