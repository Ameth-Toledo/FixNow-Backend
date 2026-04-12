import { Banner } from './entities/Banner';
import { BannerRequest } from './dto/BannerRequest';

export interface IBannerRepository {
  create(data: BannerRequest): Promise<Banner>;
  getByEmpresa(id_empresa: number): Promise<Banner[]>;
  toggle(id: number, activo: boolean): Promise<Banner | null>;
  delete(id: number): Promise<boolean>;
  incrementVistas(id: number): Promise<void>;
  incrementClicks(id: number): Promise<void>;
}
