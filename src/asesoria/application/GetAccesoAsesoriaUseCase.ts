import { IAsesoriaRepository } from '../domain/IAsesoriaRepository';
import { AccesoAsesoria } from '../domain/entities/AccesoAsesoria';

export class GetAccesoAsesoriaUseCase {
  constructor(private repo: IAsesoriaRepository) {}

  async execute(id_usuario: number, id_empresa: number): Promise<AccesoAsesoria> {
    return this.repo.getAcceso(id_usuario, id_empresa);
  }
}
