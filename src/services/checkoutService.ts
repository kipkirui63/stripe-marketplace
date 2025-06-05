
const API_BASE_URL = 'http://127.0.0.1:5500';

interface CheckoutResponse {
  checkout_url: string;
}

// Use query parameters to match Flask backend expectation
export const createCheckoutSession = async (token: string, appName: string): Promise<string> => {
  const toolId = getToolId(appName);
  
  const response = await fetch(
    `${API_BASE_URL}/stripe/create-checkout?token=${encodeURIComponent(token)}&tool_id=${encodeURIComponent(toolId)}`,
    { method: 'POST' }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create checkout session');
  }

  const data: CheckoutResponse = await response.json();
  return data.checkout_url;
};

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

// Map app names to tool IDs that match your backend database
export const getToolId = (appName: string): string => {
  const toolIdMapping: { [key: string]: string } = {
    'Business Intelligence Agent': '1',
    'AI Recruitment Assistant': '2', 
    'CrispWrite': '3',
    'SOP Assistant': '4',
    'Resume Analyzer': '5',
  };
  return toolIdMapping[appName] || '1';
};
