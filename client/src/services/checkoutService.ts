const API_BASE_URL = 'http://localhost:8000/api';

interface CheckoutResponse {
  checkout_url: string;
}

export const createCheckoutSession = async (
  token: string,
  toolId: string
): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/checkout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ tool_id: toolId })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    
    // Check if this is an authentication error (session expired)
    if (response.status === 401 || response.status === 403) {
      throw new Error('SESSION_EXPIRED');
    }
    
    throw new Error(error.detail || 'Failed to create checkout session');
  }

  const data: CheckoutResponse = await response.json();
  return data.checkout_url;
};
