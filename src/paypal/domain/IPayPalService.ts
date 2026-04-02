export interface IPayPalService {
  getAccessToken(): Promise<string>;
  createOrder(amount: number, currencyCode: string): Promise<{ id: string; status: string }>;
  captureOrder(orderID: string): Promise<{ id: string; status: string; payer?: any }>;
}
