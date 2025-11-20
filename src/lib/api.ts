import { Subscription, SubscriptionFormData, DashboardStats } from '@/types/subscription';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Subscription API calls
export const subscriptionApi = {
  getAll: () => apiCall<Subscription[]>('/subscriptions/'),
  
  getById: (id: number) => apiCall<Subscription>(`/subscriptions/${id}/`),
  
  create: (data: SubscriptionFormData) => 
    apiCall<Subscription>('/subscriptions/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: Partial<SubscriptionFormData>) =>
    apiCall<Subscription>(`/subscriptions/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiCall<void>(`/subscriptions/${id}/`, {
      method: 'DELETE',
    }),
  
  getStats: () => apiCall<DashboardStats>('/subscriptions/stats/'),
};
