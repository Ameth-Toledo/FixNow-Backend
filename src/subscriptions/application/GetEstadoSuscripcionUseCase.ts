import { ISuscripcionRepository } from '../domain/ISuscripcionRepository';
import { Suscripcion } from '../domain/entities/Suscripcion';

export class GetEstadoSuscripcionUseCase {
  constructor(private repo: ISuscripcionRepository) {}

  async execute(id_usuario: number): Promise<Suscripcion | null> {
    return this.repo.getSuscripcionActivaByUsuarioId(id_usuario);
  }
}
