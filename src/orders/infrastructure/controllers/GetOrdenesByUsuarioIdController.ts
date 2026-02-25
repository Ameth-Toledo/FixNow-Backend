import { Request, Response } from 'express';
import { GetOrdenesByUsuarioIdUseCase } from '../../application/GetOrdenesByUsuarioIdUseCase';

export class GetOrdenesByUsuarioIdController {
  constructor(private getOrdenesByUsuarioIdUseCase: GetOrdenesByUsuarioIdUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id_usuario = parseInt(req.params.id_usuario as string, 10);
      const ordenes = await this.getOrdenesByUsuarioIdUseCase.execute(id_usuario);
      res.status(200).json(ordenes);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
