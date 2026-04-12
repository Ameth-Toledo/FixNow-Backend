import { IAsesoriaRepository } from '../domain/IAsesoriaRepository';

export class ConfigurarAsesoriaUseCase {
  constructor(private repo: IAsesoriaRepository) {}

  async execute(id_empresa: number, precio: number, activa: boolean): Promise<void> {
    if (precio <= 0) throw new Error('El precio debe ser mayor a 0');
    await this.repo.configurarAsesoria(id_empresa, precio, activa);
  }
}
