const API_BASE_URL = 'https://crispai.crispvision.org/v1/api';

interface CheckoutResponse {
  checkout_url: string;
}

// Send token and product as query parameters (not in JSON body)
export const createCheckoutSession = async (token: string, product: string): Promise<string> => {
  console.log('Making request to:', `${API_BASE_URL}/stripe/create-checkout?token=${encodeURIComponent(token)}&product=${encodeURIComponent(product)}`);
  
  const response = await fetch(
    `${API_BASE_URL}/stripe/create-checkout?token=${encodeURIComponent(token)}&product=${encodeURIComponent(product)}`,
    { method: 'POST' }
  );

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const responseText = await response.text();
    console.log('Error response text:', responseText);
    
    // Check if the response is HTML (server error page)
    if (responseText.includes('<!doctype') || responseText.includes('<html')) {
      throw new Error(`Server error (${response.status}): The payment service is temporarily unavailable. Please try again later.`);
    }
    
    // Try to parse as JSON for API errors
    try {
      const errorData = JSON.parse(responseText);
      throw new Error(errorData.detail || `HTTP ${response.status}: ${errorData.message || 'Failed to create checkout session'}`);
    } catch (parseError) {
      throw new Error(`Server error (${response.status}): ${responseText || 'Failed to create checkout session'}`);
    }
  }

  const responseText = await response.text();
  console.log('Success response text:', responseText);
  
  try {
    const data: CheckoutResponse = JSON.parse(responseText);
    return data.checkout_url;
  } catch (parseError) {
    console.error('Failed to parse successful response as JSON:', parseError);
    throw new Error('Server returned invalid response format. Please try again.');
  }
};

// Map app names to backend product keys
export const getProductKey = (appName: string): string => {
  const productMapping: { [key: string]: string } = {
    'Business Intelligence Agent': 'bi_agent',
    'AI Recruitment Assistant': 'recruitment_assistant',
    'CrispWrite': 'crispwrite',
    'SOP Assistant': 'sop_agent',
    'Resume Analyzer': 'resume_analyzer',
  };
  return productMapping[appName] || appName.toLowerCase().replace(/\s+/g, '_');
};
