import { IBannerRepository } from '../domain/IBannerRepository';
import { BannerRequest } from '../domain/dto/BannerRequest';
import { Banner } from '../domain/entities/Banner';

export class CreateBannerUseCase {
  constructor(private bannerRepository: IBannerRepository) {}

  async execute(data: BannerRequest): Promise<Banner> {
    return await this.bannerRepository.create(data);
  }
}
