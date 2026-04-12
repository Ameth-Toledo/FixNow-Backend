import { Request, Response } from 'express';
import { UpdateProductUseCase } from '../../application/UpdateProductUseCase';
import { ProductUpdateRequest } from '../../domain/dto/ProductRequest';
import { uploadImageToCloudinary } from '../../../core/config/cloudinary_service';

export class UpdateProductController {
  constructor(private updateProductUseCase: UpdateProductUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid product ID' });
        return;
      }

      const body = req.body;
      const data: ProductUpdateRequest = {
        nombre:       body.nombre,
        descripcion:  body.descripcion,
        precio_venta: body.precio_venta !== undefined ? parseFloat(body.precio_venta) : undefined,
        stock_actual: body.stock_actual !== undefined ? parseInt(body.stock_actual, 10) : undefined,
        id_categoria: body.id_categoria !== undefined && body.id_categoria !== ''
                        ? parseInt(body.id_categoria, 10)
                        : undefined,
        id_empresa:   body.id_empresa !== undefined ? parseInt(body.id_empresa, 10) : undefined,
      };

      if (req.file) {
        const imageUrl = await uploadImageToCloudinary(req.file.buffer, 'products');
        data.imagen_url = imageUrl;
      }

      const product = await this.updateProductUseCase.execute(id, data);
      
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.status(200).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
