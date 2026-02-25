import { Request, Response } from 'express';
import { DeleteOrdenUseCase } from '../../application/DeleteOrdenUseCase';

export class DeleteOrdenController {
  constructor(private deleteOrdenUseCase: DeleteOrdenUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const success = await this.deleteOrdenUseCase.execute(id);
      if (!success) {
        res.status(404).json({ error: 'Orden not found' });
        return;
      }
      res.status(200).json({ message: 'Orden deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
