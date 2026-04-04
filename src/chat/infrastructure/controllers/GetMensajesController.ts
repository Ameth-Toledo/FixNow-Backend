import { Request, Response } from 'express';
import { GetMensajesUseCase } from '../../application/GetMensajesUseCase';

export class GetMensajesController {
  constructor(private getMensajesUseCase: GetMensajesUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const id_conversacion = parseInt(req.params.id_conversacion);
      const result = await this.getMensajesUseCase.execute(id_conversacion);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
