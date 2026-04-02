import { IPayPalService } from '../domain/IPayPalService';
import { PayPalOrderResponse } from '../domain/dto/PayPalOrderResponse';

export class CreatePayPalOrderUseCase {
  constructor(private paypalService: IPayPalService) {}

  async execute(monto: number, currencyCode: string = 'MXN'): Promise<PayPalOrderResponse> {
    if (!monto || monto <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }

    const order = await this.paypalService.createOrder(monto, currencyCode);

    return {
      orderID: order.id,
      status: order.status,
    };
  }
}
