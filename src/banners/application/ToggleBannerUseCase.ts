import { IBannerRepository } from '../domain/IBannerRepository';
import { Banner } from '../domain/entities/Banner';

export class ToggleBannerUseCase {
  constructor(private bannerRepository: IBannerRepository) {}

  async execute(id: number, activo: boolean): Promise<Banner | null> {
    return await this.bannerRepository.toggle(id, activo);
  }
}
