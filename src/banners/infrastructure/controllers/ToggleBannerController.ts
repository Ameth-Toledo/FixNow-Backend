import { Request, Response } from 'express';
import { ToggleBannerUseCase } from '../../application/ToggleBannerUseCase';

export class ToggleBannerController {
  constructor(private toggleBannerUseCase: ToggleBannerUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id     = parseInt(req.params.id as string);
      const activo = req.body.activo as boolean;

      if (activo === undefined || activo === null) {
        res.status(400).json({ error: 'El campo activo es requerido' });
        return;
      }

      const banner = await this.toggleBannerUseCase.execute(id, activo);
      if (!banner) {
        res.status(404).json({ error: 'Banner no encontrado' });
        return;
      }

      res.status(200).json(banner);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
