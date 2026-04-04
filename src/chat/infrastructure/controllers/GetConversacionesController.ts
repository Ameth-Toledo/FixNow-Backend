import { Request, Response } from 'express';
import { GetConversacionesUseCase } from '../../application/GetConversacionesUseCase';

export class GetConversacionesController {
  constructor(private getConversacionesUseCase: GetConversacionesUseCase) {}

  async handleByUsuario(req: Request, res: Response): Promise<void> {
    try {
      const id_usuario = parseInt(req.params.id_usuario);
      const result = await this.getConversacionesUseCase.executeByUsuario(id_usuario);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async handleByEmpresa(req: Request, res: Response): Promise<void> {
    try {
      const id_empresa = parseInt(req.params.id_empresa);
      const result = await this.getConversacionesUseCase.executeByEmpresa(id_empresa);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async handleByRepartidor(req: Request, res: Response): Promise<void> {
    try {
      const id_repartidor = parseInt(req.params.id_repartidor);
      const result = await this.getConversacionesUseCase.executeByRepartidor(id_repartidor);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
