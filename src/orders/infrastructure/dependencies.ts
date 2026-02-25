import { MySQLOrdenRepository } from './adapters/MySQLOrdenRepository';
import { CreateOrdenUseCase } from '../application/CreateOrdenUseCase';
import { GetAllOrdenesUseCase } from '../application/GetAllOrdenesUseCase';
import { GetOrdenByIdUseCase } from '../application/GetOrdenByIdUseCase';
import { GetOrdenesByUsuarioIdUseCase } from '../application/GetOrdenesByUsuarioIdUseCase';
import { UpdateOrdenUseCase } from '../application/UpdateOrdenUseCase';
import { DeleteOrdenUseCase } from '../application/DeleteOrdenUseCase';
import { CreateOrdenController } from './controllers/CreateOrdenController';
import { GetAllOrdenesController } from './controllers/GetAllOrdenesController';
import { GetOrdenByIdController } from './controllers/GetOrdenByIdController';
import { GetOrdenesByUsuarioIdController } from './controllers/GetOrdenesByUsuarioIdController';
import { UpdateOrdenController } from './controllers/UpdateOrdenController';
import { DeleteOrdenController } from './controllers/DeleteOrdenController';

const ordenRepository = new MySQLOrdenRepository();

const createOrdenUseCase = new CreateOrdenUseCase(ordenRepository);
const getAllOrdenesUseCase = new GetAllOrdenesUseCase(ordenRepository);
const getOrdenByIdUseCase = new GetOrdenByIdUseCase(ordenRepository);
const getOrdenesByUsuarioIdUseCase = new GetOrdenesByUsuarioIdUseCase(ordenRepository);
const updateOrdenUseCase = new UpdateOrdenUseCase(ordenRepository);
const deleteOrdenUseCase = new DeleteOrdenUseCase(ordenRepository);

export const createOrdenController = new CreateOrdenController(createOrdenUseCase);
export const getAllOrdenesController = new GetAllOrdenesController(getAllOrdenesUseCase);
export const getOrdenByIdController = new GetOrdenByIdController(getOrdenByIdUseCase);
export const getOrdenesByUsuarioIdController = new GetOrdenesByUsuarioIdController(getOrdenesByUsuarioIdUseCase);
export const updateOrdenController = new UpdateOrdenController(updateOrdenUseCase);
export const deleteOrdenController = new DeleteOrdenController(deleteOrdenUseCase);
