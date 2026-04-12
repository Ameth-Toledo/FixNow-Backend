import axios from 'axios';
import { IPayPalSubscriptionService } from '../../domain/IPayPalSubscriptionService';

export class PayPalSubscriptionService implements IPayPalSubscriptionService {
  private clientId: string;
  private secret: string;
  private baseUrl: string;

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || '';
    this.secret   = process.env.PAYPAL_SECRET     || '';
    this.baseUrl  = process.env.PAYPAL_API_URL    || 'https://api-m.sandbox.paypal.com';
  }

  private async getAccessToken(): Promise<string> {
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

  async createSubscription(
    paypalPlanId: string,
    returnUrl: string,
    cancelUrl: string
  ): Promise<{ id: string; approveUrl: string }> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/billing/subscriptions`,
        {
          plan_id: paypalPlanId,
          application_context: {
            brand_name: 'Voltio',
            locale: 'es-MX',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'SUBSCRIBE_NOW',
            return_url: returnUrl,
            cancel_url: cancelUrl,
          },
        },
        {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'PayPal-Request-Id': `voltio-${Date.now()}`,
          },
        }
      );

      const approveLink = response.data.links?.find((l: any) => l.rel === 'approve');
      if (!approveLink) throw new Error('PayPal no devolvió el link de aprobación');

      return {
        id: response.data.id,
        approveUrl: approveLink.href,
      };
    } catch (err: any) {
      const detail = err.response?.data;
      if (detail) {
        console.error('[PayPal] Error creando suscripción:', JSON.stringify(detail, null, 2));
        throw new Error(`PayPal: ${detail.message || JSON.stringify(detail)}`);
      }
      console.error('[PayPal] Error de red:', err.message);
      throw new Error(`Error de conexión con PayPal: ${err.message}`);
    }
  }

  async getSubscription(subscriptionId: string): Promise<{ id: string; status: string }> {
    const token = await this.getAccessToken();

    const response = await axios.get(
      `${this.baseUrl}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    return {
      id: response.data.id,
      status: response.data.status,
    };
  }

  async cancelSubscription(subscriptionId: string, reason: string): Promise<void> {
    const token = await this.getAccessToken();

    await axios.post(
      `${this.baseUrl}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`,
      { reason },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
