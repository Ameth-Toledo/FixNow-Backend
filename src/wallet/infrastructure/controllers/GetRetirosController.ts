import { Request, Response } from 'express';
import { GetRetirosUseCase } from '../../application/GetRetirosUseCase';
import { EstadoRetiro } from '../../domain/entities/Retiro';

export class GetRetirosController {
  constructor(private useCase: GetRetirosUseCase) {}

  /** GET /wallet/:id_empresa/retiros  — para la empresa */
  async handleByEmpresa(req: Request, res: Response): Promise<void> {
    try {
      const id_empresa = parseInt(String(req.params.id_empresa));
      const retiros    = await this.useCase.byEmpresa(id_empresa);
      res.json(retiros);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** GET /admin/retiros?estado=pendiente  — para el admin */
  async handleAll(req: Request, res: Response): Promise<void> {
    try {
      const estado  = req.query.estado as EstadoRetiro | undefined;
      const retiros = await this.useCase.all(estado);
      res.json(retiros);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
