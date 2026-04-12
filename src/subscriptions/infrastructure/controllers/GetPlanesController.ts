import { Request, Response } from 'express';
import { GetPlanesUseCase } from '../../application/GetPlanesUseCase';

export class GetPlanesController {
  constructor(private useCase: GetPlanesUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const tipo_rol = req.query.tipo_rol as string | undefined;
      const planes = await this.useCase.execute(tipo_rol);
      res.json(planes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
