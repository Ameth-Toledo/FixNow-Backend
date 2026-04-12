import { IWalletRepository } from '../domain/IWalletRepository';
import { Retiro, MetodoRetiro } from '../domain/entities/Retiro';

const MONTO_MINIMO = 100; // MXN

export class SolicitarRetiroUseCase {
  constructor(private repo: IWalletRepository) {}

  async execute(data: {
    id_empresa:   number;
    monto:        number;
    metodo:       MetodoRetiro;
    datos_cuenta: Record<string, any>;
  }): Promise<Retiro> {
    if (data.monto < MONTO_MINIMO) {
      throw new Error(`El monto mínimo de retiro es $${MONTO_MINIMO} MXN`);
    }

    // Verificar saldo disponible
    const wallet = await this.repo.getWallet(data.id_empresa);
    if (!wallet) throw new Error('Wallet no encontrado');
    if (wallet.saldo_disponible < data.monto) {
      throw new Error(`Saldo insuficiente. Disponible: $${wallet.saldo_disponible.toFixed(2)} MXN`);
    }

    return this.repo.solicitarRetiro(data);
  }
}
