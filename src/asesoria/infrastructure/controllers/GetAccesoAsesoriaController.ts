import { Request, Response } from 'express';
import { GetAccesoAsesoriaUseCase } from '../../application/GetAccesoAsesoriaUseCase';

export class GetAccesoAsesoriaController {
  constructor(private useCase: GetAccesoAsesoriaUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id_usuario = req.userId!;
      const id_empresa = parseInt(String(req.params.id_empresa));

      if (!id_empresa) {
        res.status(400).json({ error: 'id_empresa es requerido' });
        return;
      }

      const acceso = await this.useCase.execute(id_usuario, id_empresa);
      res.json(acceso);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
