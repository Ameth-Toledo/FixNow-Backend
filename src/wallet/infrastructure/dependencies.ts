import { MySQLWalletRepository } from './adapters/MySQLWalletRepository';
import { GetWalletUseCase } from '../application/GetWalletUseCase';
import { SolicitarRetiroUseCase } from '../application/SolicitarRetiroUseCase';
import { GetRetirosUseCase } from '../application/GetRetirosUseCase';
import { ProcesarRetiroUseCase } from '../application/ProcesarRetiroUseCase';
import { GetWalletController } from './controllers/GetWalletController';
import { SolicitarRetiroController } from './controllers/SolicitarRetiroController';
import { GetRetirosController } from './controllers/GetRetirosController';
import { ProcesarRetiroController } from './controllers/ProcesarRetiroController';

const walletRepository = new MySQLWalletRepository();

const getWalletUseCase       = new GetWalletUseCase(walletRepository);
const solicitarRetiroUseCase = new SolicitarRetiroUseCase(walletRepository);
const getRetirosUseCase      = new GetRetirosUseCase(walletRepository);
const procesarRetiroUseCase  = new ProcesarRetiroUseCase(walletRepository);

export const getWalletController       = new GetWalletController(getWalletUseCase);
export const solicitarRetiroController = new SolicitarRetiroController(solicitarRetiroUseCase);
export const getRetirosController      = new GetRetirosController(getRetirosUseCase);
export const procesarRetiroController  = new ProcesarRetiroController(procesarRetiroUseCase);
