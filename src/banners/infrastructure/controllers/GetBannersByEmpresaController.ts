import { Request, Response } from 'express';
import { GetBannersByEmpresaUseCase } from '../../application/GetBannersByEmpresaUseCase';

export class GetBannersByEmpresaController {
  constructor(private getBannersByEmpresaUseCase: GetBannersByEmpresaUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id_empresa = parseInt(req.params.id_empresa as string);
      const banners = await this.getBannersByEmpresaUseCase.execute(id_empresa);
      res.status(200).json(banners);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
