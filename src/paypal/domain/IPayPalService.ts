export interface IPayPalService {
  getAccessToken(): Promise<string>;
  createOrder(
    amount: number,
    currencyCode: string,
    options?: { returnUrl?: string; cancelUrl?: string }
  ): Promise<{ id: string; status: string }>;
  captureOrder(orderID: string): Promise<{ id: string; status: string; payer?: any }>;
}
