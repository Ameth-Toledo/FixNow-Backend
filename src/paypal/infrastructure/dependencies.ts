import { PayPalServiceAdapter } from './adapters/PayPalServiceAdapter';
import { CreatePayPalOrderUseCase } from '../application/CreatePayPalOrderUseCase';
import { CapturePayPalOrderUseCase } from '../application/CapturePayPalOrderUseCase';
import { CreatePayPalOrderController } from './controllers/CreatePayPalOrderController';
import { CapturePayPalOrderController } from './controllers/CapturePayPalOrderController';

const paypalService = new PayPalServiceAdapter();

const createPayPalOrderUseCase = new CreatePayPalOrderUseCase(paypalService);
const capturePayPalOrderUseCase = new CapturePayPalOrderUseCase(paypalService);

export const createPayPalOrderController = new CreatePayPalOrderController(createPayPalOrderUseCase);
export const capturePayPalOrderController = new CapturePayPalOrderController(capturePayPalOrderUseCase);
