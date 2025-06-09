// checkoutService.ts
const API_BASE_URL = 'http://localhost:8000';

interface CheckoutResponse {
  checkout_url: string;
}

export const createCheckoutSession = async (token: string, toolId: string): Promise<string> => {
  try {
    // Validate token exists and isn't expired
    if (!token || token.split('.').length !== 3) {
      throw new Error('Invalid or malformed token');
    }

    const response = await fetch(`${API_BASE_URL}/api/stripe/create-checkout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ tool_id: toolId })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create checkout session');
    }

    const data: CheckoutResponse = await response.json();
    return data.checkout_url;
  } catch (error) {
    console.error('Checkout session creation error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create checkout session');
  }
};