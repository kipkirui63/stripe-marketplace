
const API_BASE_URL = 'http://127.0.0.1:8000';

interface CheckoutRequest {
  token: string;
  product: string;
}

interface CheckoutResponse {
  checkout_url: string;
}

export const createCheckoutSession = async (token: string, product: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/create-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      token, 
      product,
      success_url: `${window.location.origin}/marketplace`,
      cancel_url: `${window.location.origin}/marketplace`
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create checkout session');
  }

  const data: CheckoutResponse = await response.json();
  return data.checkout_url;
};

// Map app names to product keys for your backend
export const getProductKey = (appName: string): string => {
  const productMapping: { [key: string]: string } = {
    'Business Intelligence Agent': 'bi_agent',
    'AI Recruitment Assistant': 'recruitment_assistant',
    'CrispWrite': 'crispwrite',
    'SOP Assistant': 'sop_agent',
    'Resume Analyzer': 'resume_analyzer'
  };
  
  return productMapping[appName] || appName.toLowerCase().replace(/\s+/g, '_');
};
