import { MySQLSuscripcionRepository } from './adapters/MySQLSuscripcionRepository';
import { PayPalSubscriptionService } from './paypal/PayPalSubscriptionService';
import { PayPalSetupService } from './paypal/PayPalSetupService';

import { GetPlanesUseCase } from '../application/GetPlanesUseCase';
import { IniciarSuscripcionUseCase } from '../application/IniciarSuscripcionUseCase';
import { ActivarSuscripcionUseCase } from '../application/ActivarSuscripcionUseCase';
import { CancelarSuscripcionUseCase } from '../application/CancelarSuscripcionUseCase';
import { GetEstadoSuscripcionUseCase } from '../application/GetEstadoSuscripcionUseCase';
import { ProcesarWebhookUseCase } from '../application/ProcesarWebhookUseCase';
import { ActualizarVencimientosUseCase } from '../application/ActualizarVencimientosUseCase';
import { SetupPlanesPayPalUseCase } from '../application/SetupPlanesPayPalUseCase';

import { GetPlanesController } from './controllers/GetPlanesController';
import { IniciarSuscripcionController } from './controllers/IniciarSuscripcionController';
import { RetornoPayPalController } from './controllers/RetornoPayPalController';
import { WebhookController } from './controllers/WebhookController';
import { GetEstadoController } from './controllers/GetEstadoController';
import { CancelarSuscripcionController } from './controllers/CancelarSuscripcionController';
import { SetupPlanesController } from './controllers/SetupPlanesController';

const suscripcionRepository     = new MySQLSuscripcionRepository();
const paypalSubscriptionService = new PayPalSubscriptionService();
const paypalSetupService        = new PayPalSetupService();

const getPlanesUseCase              = new GetPlanesUseCase(suscripcionRepository);
const iniciarSuscripcionUseCase     = new IniciarSuscripcionUseCase(suscripcionRepository, paypalSubscriptionService);
const activarSuscripcionUseCase     = new ActivarSuscripcionUseCase(suscripcionRepository);
const cancelarSuscripcionUseCase    = new CancelarSuscripcionUseCase(suscripcionRepository, paypalSubscriptionService);
const getEstadoSuscripcionUseCase   = new GetEstadoSuscripcionUseCase(suscripcionRepository);
const procesarWebhookUseCase        = new ProcesarWebhookUseCase(suscripcionRepository);
export const actualizarVencimientosUseCase = new ActualizarVencimientosUseCase(suscripcionRepository);
const setupPlanesPayPalUseCase             = new SetupPlanesPayPalUseCase(suscripcionRepository, paypalSetupService);

export const getPlanesController           = new GetPlanesController(getPlanesUseCase);
export const iniciarSuscripcionController  = new IniciarSuscripcionController(iniciarSuscripcionUseCase);
export const retornoPayPalController       = new RetornoPayPalController(activarSuscripcionUseCase);
export const webhookController             = new WebhookController(procesarWebhookUseCase);
export const getEstadoController           = new GetEstadoController(getEstadoSuscripcionUseCase);
export const cancelarSuscripcionController = new CancelarSuscripcionController(cancelarSuscripcionUseCase);
export const setupPlanesController         = new SetupPlanesController(setupPlanesPayPalUseCase);

export { suscripcionRepository };
