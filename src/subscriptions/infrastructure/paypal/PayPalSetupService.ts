import axios from 'axios';

export class PayPalSetupService {
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

  async crearProducto(): Promise<string> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/catalogs/products`,
        {
          name:        'Voltio Suscripcion',
          description: 'Acceso mensual a la plataforma Voltio',
          type:        'SERVICE',
          category:    'SOFTWARE',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization:  `Bearer ${token}`,
            'PayPal-Request-Id': `voltio-product-${Date.now()}`,
          },
        }
      );
      return response.data.id;
    } catch (err: any) {
      const detail = err.response?.data;
      console.error('[PayPal] Error creando producto:', JSON.stringify(detail, null, 2));
      throw new Error(`PayPal producto: ${detail?.message || err.message}`);
    }
  }

  async crearPlan(params: {
    productId:   string;
    nombre:      string;
    descripcion: string;
    precio:      number;
    moneda:      string;
  }): Promise<string> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/billing/plans`,
        {
          product_id:  params.productId,
          name:        params.nombre,
          description: params.descripcion.substring(0, 127),
          status:      'ACTIVE',
          billing_cycles: [
            {
              frequency: {
                interval_unit:  'MONTH',
                interval_count: 1,
              },
              tenure_type:    'REGULAR',
              sequence:       1,
              total_cycles:   0,
              pricing_scheme: {
                fixed_price: {
                  value:         params.precio.toFixed(2),
                  currency_code: params.moneda,
                },
              },
            },
          ],
          payment_preferences: {
            auto_bill_outstanding:     true,
            setup_fee_failure_action:  'CONTINUE',
            payment_failure_threshold: 3,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization:  `Bearer ${token}`,
            'PayPal-Request-Id': `voltio-plan-${params.nombre}-${Date.now()}`,
          },
        }
      );
      return response.data.id;
    } catch (err: any) {
      const detail = err.response?.data;
      console.error('[PayPal] Error creando plan:', JSON.stringify(detail, null, 2));
      throw new Error(`PayPal plan "${params.nombre}": ${detail?.message || err.message}`);
    }
  }
}
