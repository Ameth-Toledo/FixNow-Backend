import { Router, Request, Response } from 'express';
import { CreateProductUseCase } from '../../application/CreateProductUseCase';
import { ProductRequest } from '../../domain/dto/ProductRequest';
import { uploadImageToCloudinary } from '../../../core/config/cloudinary_service';

export class CreateProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;
      const data: ProductRequest = {
        nombre:       body.nombre,
        sku:          body.sku,
        descripcion:  body.descripcion,
        precio_venta: parseFloat(body.precio_venta),
        stock_actual: parseInt(body.stock_actual ?? '0', 10),
        id_categoria: body.id_categoria ? parseInt(body.id_categoria, 10) : undefined,
        id_empresa:   body.id_empresa   ? parseInt(body.id_empresa, 10)   : undefined,
      };

      if (req.file) {
        const imageUrl = await uploadImageToCloudinary(req.file.buffer, 'products');
        data.imagen_url = imageUrl;
      }

      const product = await this.createProductUseCase.execute(data);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
