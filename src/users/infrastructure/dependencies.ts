import { MySQLUserRepository } from './adapters/MySQLAdapter';
import { AuthService } from '../application/AuthService';
import { CreateUserUseCase } from '../application/CreateUserUseCase';
import { GetAllUsersUseCase } from '../application/GetAllUsersUseCase';
import { GetUserByIdUseCase } from '../application/GetUserByIdUseCase';
import { UpdateUserUseCase } from '../application/UpdateUserUseCase';
import { DeleteUserUseCase } from '../application/DeleteUserUseCase';
import { AuthController } from './controllers/AuthController';
import { CreateUserController } from './controllers/CreateUserController';
import { RegisterCompanyController } from './controllers/RegisterCompanyController';
import { GoogleRegisterCompanyController } from './controllers/GoogleRegisterCompanyController';
import { GetAllUsersController } from './controllers/GetAllUsersController';
import { GetUserByIdController } from './controllers/GetUserByIdController';
import { UpdateUserController } from './controllers/UpdateUserController';
import { DeleteUserController } from './controllers/DeleteUserController';
import { ChangePasswordController } from './controllers/ChangePasswordController';
import { empresaRepository } from '../../empresas/infrastructure/dependencies';

const userRepository = new MySQLUserRepository();

const authService = new AuthService(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

export const authController = new AuthController(authService);
export const createUserController = new CreateUserController(createUserUseCase);
export const registerCompanyController = new RegisterCompanyController(createUserUseCase, empresaRepository);
export const googleRegisterCompanyController = new GoogleRegisterCompanyController(authService, empresaRepository);
export const getAllUsersController = new GetAllUsersController(getAllUsersUseCase);
export const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);
export const updateUserController = new UpdateUserController(updateUserUseCase);
export const deleteUserController = new DeleteUserController(deleteUserUseCase);
export const changePasswordController = new ChangePasswordController(userRepository);