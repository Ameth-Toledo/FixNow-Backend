import { Request, Response } from 'express';
import { DeleteBannerUseCase } from '../../application/DeleteBannerUseCase';

export class DeleteBannerController {
  constructor(private deleteBannerUseCase: DeleteBannerUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id      = parseInt(req.params.id as string);
      const deleted = await this.deleteBannerUseCase.execute(id);

      if (!deleted) {
        res.status(404).json({ error: 'Banner no encontrado' });
        return;
      }

      res.status(200).json({ message: 'Banner eliminado correctamente' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
