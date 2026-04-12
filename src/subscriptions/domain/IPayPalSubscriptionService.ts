export interface IPayPalSubscriptionService {
  createSubscription(
    paypalPlanId: string,
    returnUrl: string,
    cancelUrl: string
  ): Promise<{ id: string; approveUrl: string }>;

  getSubscription(subscriptionId: string): Promise<{ id: string; status: string }>;
  cancelSubscription(subscriptionId: string, reason: string): Promise<void>;
}
