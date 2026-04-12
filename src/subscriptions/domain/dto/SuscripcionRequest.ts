export interface IniciarSuscripcionRequest {
  id_usuario: number;
  id_plan: number;
}

export interface WebhookPayPalRequest {
  event_type: string;
  resource: {
    id: string;
    status?: string;
    billing_agreement_id?: string;
  };
}
