import { Request, Response } from 'express';
import { SolicitarRetiroUseCase } from '../../application/SolicitarRetiroUseCase';
import { MetodoRetiro } from '../../domain/entities/Retiro';

export class SolicitarRetiroController {
  constructor(private useCase: SolicitarRetiroUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id_empresa, monto, metodo, datos_cuenta } = req.body;

      if (!id_empresa || !monto || !metodo || !datos_cuenta) {
        res.status(400).json({ error: 'id_empresa, monto, metodo y datos_cuenta son requeridos' });
        return;
      }

      const metodosValidos: MetodoRetiro[] = ['transferencia', 'paypal'];
      if (!metodosValidos.includes(metodo)) {
        res.status(400).json({ error: `Método inválido. Use: ${metodosValidos.join(', ')}` });
        return;
      }

      const retiro = await this.useCase.execute({
        id_empresa: Number(id_empresa),
        monto:      Number(monto),
        metodo:     metodo as MetodoRetiro,
        datos_cuenta,
      });

      res.status(201).json(retiro);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
