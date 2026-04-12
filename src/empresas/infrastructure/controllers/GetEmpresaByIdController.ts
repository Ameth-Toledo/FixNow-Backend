import { Request, Response } from 'express';
import { GetEmpresaByIdUseCase } from '../../application/GetEmpresaByIdUseCase';
import { IAsesoriaRepository } from '../../../asesoria/domain/IAsesoriaRepository';

export class GetEmpresaByIdController {
  constructor(
    private getEmpresaByIdUseCase: GetEmpresaByIdUseCase,
    private asesoriaRepo?: IAsesoriaRepository
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id      = parseInt(req.params.id as string, 10);
      const empresa = await this.getEmpresaByIdUseCase.execute(id);

      // Si hay un usuario autenticado y un repositorio de asesoría, incluir su acceso
      let acceso_asesoria = null;
      if (req.userId && this.asesoriaRepo) {
        acceso_asesoria = await this.asesoriaRepo.getAcceso(req.userId, id);
      }

      res.status(200).json({ ...empresa, acceso_asesoria });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
