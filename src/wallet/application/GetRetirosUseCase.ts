import { IWalletRepository } from '../domain/IWalletRepository';
import { Retiro, EstadoRetiro } from '../domain/entities/Retiro';

export class GetRetirosUseCase {
  constructor(private repo: IWalletRepository) {}

  /** Para la empresa: sus propios retiros */
  async byEmpresa(id_empresa: number): Promise<Retiro[]> {
    return this.repo.getRetirosByEmpresa(id_empresa);
  }

  /** Para el admin: todos los retiros, con filtro opcional por estado */
  async all(estado?: EstadoRetiro): Promise<Retiro[]> {
    return this.repo.getAllRetiros(estado);
  }
}
