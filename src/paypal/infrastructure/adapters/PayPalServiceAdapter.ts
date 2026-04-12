import axios from 'axios';
import { IPayPalService } from '../../domain/IPayPalService';

export class PayPalServiceAdapter implements IPayPalService {
  private clientId: string;
  private secret: string;
  private baseUrl: string;

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || '';
    this.secret = process.env.PAYPAL_SECRET || '';
    this.baseUrl = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

    if (!this.clientId || !this.secret) {
      console.warn('⚠️ PAYPAL_CLIENT_ID o PAYPAL_SECRET no están configurados en .env');
    }
  }

  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.secret}`).toString('base64');

    const response = await axios.post(
      `${this.baseUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  }

  async createOrder(
    amount: number,
    currencyCode: string,
    options?: { returnUrl?: string; cancelUrl?: string }
  ): Promise<{ id: string; status: string }> {
    const accessToken = await this.getAccessToken();

    const body: any = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currencyCode,
            value: amount.toFixed(2),
          },
        },
      ],
    };

    if (options?.returnUrl || options?.cancelUrl) {
      body.application_context = {
        ...(options.returnUrl && { return_url: options.returnUrl }),
        ...(options.cancelUrl && { cancel_url: options.cancelUrl }),
        brand_name: 'Voltio',
        user_action: 'PAY_NOW',
      };
    }

    const response = await axios.post(
      `${this.baseUrl}/v2/checkout/orders`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      id: response.data.id,
      status: response.data.status,
    };
  }

  async captureOrder(orderID: string): Promise<{ id: string; status: string; payer?: any }> {
    const accessToken = await this.getAccessToken();

    const response = await axios.post(
      `${this.baseUrl}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      id: response.data.id,
      status: response.data.status,
      payer: response.data.payer,
    };
  }
}
