import { Request, Response } from 'express';
import { CreateBannerUseCase } from '../../application/CreateBannerUseCase';
import { BannerRequest } from '../../domain/dto/BannerRequest';
import { uploadImageToCloudinary } from '../../../core/config/cloudinary_service';

export class CreateBannerController {
  constructor(private createBannerUseCase: CreateBannerUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const data: BannerRequest = {
        id_empresa:   Number(req.body.id_empresa),
        nombre:       req.body.nombre,
        activo:       req.body.activo !== undefined ? Boolean(req.body.activo) : true,
        fecha_inicio: req.body.fecha_inicio,
        fecha_fin:    req.body.fecha_fin,
      };

      if (req.file) {
        data.imagen_url = await uploadImageToCloudinary(req.file.buffer, 'banners');
      }

      const banner = await this.createBannerUseCase.execute(data);
      res.status(201).json(banner);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
