import { Request, Response } from 'express';
import { CrearConversacionUseCase } from '../../application/CrearConversacionUseCase';

export class CrearConversacionController {
  constructor(private crearConversacionUseCase: CrearConversacionUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.crearConversacionUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
