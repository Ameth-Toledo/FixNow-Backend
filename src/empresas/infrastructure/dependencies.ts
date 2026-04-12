import { MySQLEmpresaRepository } from './adapters/MySQLEmpresaRepository';
import { MySQLAsesoriaRepository } from '../../asesoria/infrastructure/adapters/MySQLAsesoriaRepository';
import { CreateEmpresaUseCase } from '../application/CreateEmpresaUseCase';
import { GetAllEmpresasUseCase } from '../application/GetAllEmpresasUseCase';
import { GetEmpresaByIdUseCase } from '../application/GetEmpresaByIdUseCase';
import { GetEmpresaByUsuarioIdUseCase } from '../application/GetEmpresaByUsuarioIdUseCase';
import { UpdateEmpresaUseCase } from '../application/UpdateEmpresaUseCase';
import { DeleteEmpresaUseCase } from '../application/DeleteEmpresaUseCase';
import { CreateEmpresaController } from './controllers/CreateEmpresaController';
import { GetAllEmpresasController } from './controllers/GetAllEmpresasController';
import { GetEmpresaByIdController } from './controllers/GetEmpresaByIdController';
import { GetEmpresaByUsuarioIdController } from './controllers/GetEmpresaByUsuarioIdController';
import { UpdateEmpresaController } from './controllers/UpdateEmpresaController';
import { DeleteEmpresaController } from './controllers/DeleteEmpresaController';

const empresaRepository  = new MySQLEmpresaRepository();
const asesoriaRepository = new MySQLAsesoriaRepository();

const createEmpresaUseCase         = new CreateEmpresaUseCase(empresaRepository);
const getAllEmpresasUseCase         = new GetAllEmpresasUseCase(empresaRepository);
const getEmpresaByIdUseCase        = new GetEmpresaByIdUseCase(empresaRepository);
const getEmpresaByUsuarioIdUseCase = new GetEmpresaByUsuarioIdUseCase(empresaRepository);
const updateEmpresaUseCase         = new UpdateEmpresaUseCase(empresaRepository);
const deleteEmpresaUseCase         = new DeleteEmpresaUseCase(empresaRepository);

export const createEmpresaController         = new CreateEmpresaController(createEmpresaUseCase);
export const getAllEmpresasController         = new GetAllEmpresasController(getAllEmpresasUseCase);
export const getEmpresaByIdController        = new GetEmpresaByIdController(getEmpresaByIdUseCase, asesoriaRepository);
export const getEmpresaByUsuarioIdController = new GetEmpresaByUsuarioIdController(getEmpresaByUsuarioIdUseCase);
export const updateEmpresaController         = new UpdateEmpresaController(updateEmpresaUseCase);
export const deleteEmpresaController         = new DeleteEmpresaController(deleteEmpresaUseCase);

export { empresaRepository };
