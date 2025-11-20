export type BillingCycle = 'monthly' | 'yearly';

export interface Subscription {
  id: number;
  name: string;
  cost: number;
  billing_cycle: BillingCycle;
  start_date: string;
  renewal_date: string;
  is_active: boolean;
  category?: string;
}

export interface SubscriptionFormData {
  name: string;
  cost: number;
  billing_cycle: BillingCycle;
  start_date: string;
  category?: string;
}

export interface DashboardStats {
  total_monthly_cost: number;
  total_yearly_cost: number;
  active_subscriptions_count: number;
  upcoming_renewals_count: number;
}
