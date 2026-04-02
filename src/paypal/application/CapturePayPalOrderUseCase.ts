import { IPayPalService } from '../domain/IPayPalService';
import { PayPalCaptureResponse } from '../domain/dto/PayPalOrderResponse';

export class CapturePayPalOrderUseCase {
  constructor(private paypalService: IPayPalService) {}

  async execute(orderID: string): Promise<PayPalCaptureResponse> {
    if (!orderID || orderID.trim().length === 0) {
      throw new Error('El Order ID de PayPal es obligatorio');
    }

    const capture = await this.paypalService.captureOrder(orderID);

    return {
      orderID: capture.id,
      status: capture.status,
      payer: capture.payer,
    };
  }
}
