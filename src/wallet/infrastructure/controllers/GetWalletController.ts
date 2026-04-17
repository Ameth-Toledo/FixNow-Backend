import { Request, Response } from 'express';
import { GetWalletUseCase } from '../../application/GetWalletUseCase';

export class GetWalletController {
  constructor(private useCase: GetWalletUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id_empresa = parseInt(String(req.params.id_empresa));
      if (!id_empresa) {
        res.status(400).json({ error: 'id_empresa es requerido' });
        return;
      }
      const wallet = await this.useCase.execute(id_empresa);
      res.json(wallet);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
