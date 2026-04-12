import { Request, Response } from 'express';
import { IniciarPagoAsesoriaUseCase } from '../../application/IniciarPagoAsesoriaUseCase';

export class IniciarPagoAsesoriaController {
  constructor(private useCase: IniciarPagoAsesoriaUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id_usuario = req.userId!;
      const id_empresa = parseInt(String(req.body.id_empresa));

      if (!id_empresa) {
        res.status(400).json({ error: 'id_empresa es requerido' });
        return;
      }

      const result = await this.useCase.execute(id_usuario, id_empresa);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
