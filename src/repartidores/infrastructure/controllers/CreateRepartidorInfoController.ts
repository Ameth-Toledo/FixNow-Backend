import { Request, Response } from 'express';
import { CreateRepartidorInfoUseCase } from '../../application/CreateRepartidorInfoUseCase';

export class CreateRepartidorInfoController {
  constructor(private useCase: CreateRepartidorInfoUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const info = await this.useCase.execute(data);
      res.status(201).json(info);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
