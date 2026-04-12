import { MySQLBannerRepository } from './adapters/MySQLBannerRepository';
import { CreateBannerUseCase } from '../application/CreateBannerUseCase';
import { GetBannersByEmpresaUseCase } from '../application/GetBannersByEmpresaUseCase';
import { ToggleBannerUseCase } from '../application/ToggleBannerUseCase';
import { DeleteBannerUseCase } from '../application/DeleteBannerUseCase';
import { CreateBannerController } from './controllers/CreateBannerController';
import { GetBannersByEmpresaController } from './controllers/GetBannersByEmpresaController';
import { ToggleBannerController } from './controllers/ToggleBannerController';
import { DeleteBannerController } from './controllers/DeleteBannerController';

const bannerRepository = new MySQLBannerRepository();

const createBannerUseCase         = new CreateBannerUseCase(bannerRepository);
const getBannersByEmpresaUseCase  = new GetBannersByEmpresaUseCase(bannerRepository);
const toggleBannerUseCase         = new ToggleBannerUseCase(bannerRepository);
const deleteBannerUseCase         = new DeleteBannerUseCase(bannerRepository);

export const createBannerController        = new CreateBannerController(createBannerUseCase);
export const getBannersByEmpresaController = new GetBannersByEmpresaController(getBannersByEmpresaUseCase);
export const toggleBannerController        = new ToggleBannerController(toggleBannerUseCase);
export const deleteBannerController        = new DeleteBannerController(deleteBannerUseCase);
