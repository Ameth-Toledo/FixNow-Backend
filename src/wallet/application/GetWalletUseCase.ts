import { IWalletRepository } from '../domain/IWalletRepository';
import { Wallet } from '../domain/entities/Wallet';

export class GetWalletUseCase {
  constructor(private repo: IWalletRepository) {}

  async execute(id_empresa: number): Promise<Wallet> {
    const wallet = await this.repo.getWallet(id_empresa);
    if (!wallet) throw new Error('Wallet no encontrado para esta empresa');
    return wallet;
  }
}
