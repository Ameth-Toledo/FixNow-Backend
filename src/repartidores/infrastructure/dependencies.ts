import { MySQLRepartidorInfoRepository } from './adapters/MySQLRepartidorInfoRepository';
import { CreateRepartidorInfoUseCase } from '../application/CreateRepartidorInfoUseCase';
import { UpdateRepartidorInfoUseCase } from '../application/UpdateRepartidorInfoUseCase';
import { GetRepartidoresDisponiblesUseCase } from '../application/GetRepartidoresDisponiblesUseCase';
import { GetRepartidorInfoByUsuarioIdUseCase } from '../application/GetRepartidorInfoByUsuarioIdUseCase';
import { CreateRepartidorInfoController } from './controllers/CreateRepartidorInfoController';
import { UpdateRepartidorInfoController } from './controllers/UpdateRepartidorInfoController';
import { GetRepartidoresDisponiblesController } from './controllers/GetRepartidoresDisponiblesController';
import { GetRepartidorInfoByUsuarioIdController } from './controllers/GetRepartidorInfoByUsuarioIdController';

const repartidorInfoRepository = new MySQLRepartidorInfoRepository();

const createRepartidorInfoUseCase = new CreateRepartidorInfoUseCase(repartidorInfoRepository);
const updateRepartidorInfoUseCase = new UpdateRepartidorInfoUseCase(repartidorInfoRepository);
const getRepartidoresDisponiblesUseCase = new GetRepartidoresDisponiblesUseCase(repartidorInfoRepository);
const getRepartidorInfoByUsuarioIdUseCase = new GetRepartidorInfoByUsuarioIdUseCase(repartidorInfoRepository);

export const createRepartidorInfoController = new CreateRepartidorInfoController(createRepartidorInfoUseCase);
export const updateRepartidorInfoController = new UpdateRepartidorInfoController(updateRepartidorInfoUseCase);
export const getRepartidoresDisponiblesController = new GetRepartidoresDisponiblesController(getRepartidoresDisponiblesUseCase);
export const getRepartidorInfoByUsuarioIdController = new GetRepartidorInfoByUsuarioIdController(getRepartidorInfoByUsuarioIdUseCase);
