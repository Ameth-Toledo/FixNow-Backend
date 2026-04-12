import { IBannerRepository } from '../domain/IBannerRepository';

export class DeleteBannerUseCase {
  constructor(private bannerRepository: IBannerRepository) {}

  async execute(id: number): Promise<boolean> {
    return await this.bannerRepository.delete(id);
  }
}
