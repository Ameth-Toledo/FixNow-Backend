import { IBannerRepository } from '../domain/IBannerRepository';
import { Banner } from '../domain/entities/Banner';

export class GetBannersByEmpresaUseCase {
  constructor(private bannerRepository: IBannerRepository) {}

  async execute(id_empresa: number): Promise<Banner[]> {
    return await this.bannerRepository.getByEmpresa(id_empresa);
  }
}
