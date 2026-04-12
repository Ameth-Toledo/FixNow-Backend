import { IWalletRepository } from '../domain/IWalletRepository';
import { EstadoRetiro } from '../domain/entities/Retiro';

export class ProcesarRetiroUseCase {
  constructor(private repo: IWalletRepository) {}

  async execute(id_retiro: number, estado: EstadoRetiro, notas_admin?: string): Promise<void> {
    if (estado !== 'procesado' && estado !== 'rechazado') {
      throw new Error('Estado inválido. Use "procesado" o "rechazado"');
    }
    await this.repo.procesarRetiro(id_retiro, estado, notas_admin);
  }
}
