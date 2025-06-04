
// checkout.ts (React frontend utils)

const API_BASE_URL = 'https://crispai.crispvision.org/v1/api';

interface CheckoutRequest {
  token: string;
  product: string;
}

interface CheckoutResponse {
  checkout_url: string;
}

export const createCheckoutSession = async (token: string, product: string): Promise<string> => {
  console.log('Creating checkout session for product:', product);
  console.log('API Base URL:', API_BASE_URL);
  
  try {
    const requestBody = {
      token,
      product,
      success_url: `${window.location.origin}/marketplace`,
      cancel_url: `${window.location.origin}/marketplace`
    };
    
    console.log('Request body:', requestBody);
    
    const response = await fetch(`${API_BASE_URL}/checkout/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      let errorMessage = 'Failed to create checkout session';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        console.log('Could not parse error as JSON, using text response');
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const data: CheckoutResponse = await response.json();
    console.log('Checkout session created successfully:', data);
    return data.checkout_url;
  } catch (error) {
    console.error('Checkout service error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the payment service. Please check your internet connection and try again.');
    }
    
    throw error;
  }
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
