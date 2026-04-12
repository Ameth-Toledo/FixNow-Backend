import { Wallet } from './entities/Wallet';
import { Retiro, EstadoRetiro, MetodoRetiro } from './entities/Retiro';

export interface IWalletRepository {
  // Wallet de la empresa
  getWallet(id_empresa: number): Promise<Wallet | null>;

  // Retiros
  solicitarRetiro(data: {
    id_empresa:   number;
    monto:        number;
    metodo:       MetodoRetiro;
    datos_cuenta: Record<string, any>;
  }): Promise<Retiro>;

  getRetirosByEmpresa(id_empresa: number): Promise<Retiro[]>;

  // Admin
  getAllRetiros(estado?: EstadoRetiro): Promise<Retiro[]>;
  procesarRetiro(id_retiro: number, estado: EstadoRetiro, notas_admin?: string): Promise<void>;
}
