import { IWalletRepository } from '../domain/IWalletRepository';
import { Wallet } from '../domain/entities/Wallet';

export class GetWalletUseCase {
  constructor(private repo: IWalletRepository) {}

  async execute(id_empresa: number): Promise<Wallet> {
    const wallet = await this.repo.getWallet(id_empresa);
    // El repositorio ya auto-crea el wallet con INSERT ... ON DUPLICATE KEY,
    // por lo que null solo puede ocurrir si la tabla no existe aún (primer deploy).
    if (!wallet) {
      return {
        id_wallet:        0,
        id_empresa,
        saldo_disponible: 0,
        saldo_retenido:   0,
        total_ganado:     0,
        updated_at:       new Date(),
      };
    }
    return wallet;
  }
}
