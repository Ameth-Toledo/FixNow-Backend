export interface PayPalOrderResponse {
  orderID: string;
  status: string;
}

export interface PayPalCaptureResponse {
  orderID: string;
  status: string;
  payer?: {
    email_address?: string;
    payer_id?: string;
  };
}
