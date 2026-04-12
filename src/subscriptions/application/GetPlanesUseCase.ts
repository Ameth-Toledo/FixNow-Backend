import { ISuscripcionRepository } from '../domain/ISuscripcionRepository';
import { Plan } from '../domain/entities/Plan';

export class GetPlanesUseCase {
  constructor(private repo: ISuscripcionRepository) {}

  async execute(tipo_rol?: string): Promise<Plan[]> {
    return this.repo.getPlanes(tipo_rol);
  }
}
