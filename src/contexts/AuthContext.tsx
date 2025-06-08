import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const API_BASE_URL = 'http://localhost:8000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      const storedEmail = localStorage.getItem('email');
      const storedUser = localStorage.getItem('user');
      if (storedEmail && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Login failed' }));
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      const newToken = data.access;

      setToken(newToken);
      setUser(data.user);
      localStorage.setItem('token', newToken);
      localStorage.setItem('email', data.user.email);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, phone: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          password,
          repeat_password: password,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Registration failed' }));
        throw new Error(error.detail || 'Registration failed');
      }

      alert('Registration successful. Please check your email to activate your account.');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

interface CheckoutResponse {
  checkout_url: string;
}

export const createCheckoutSession = async (token: string, appName: string): Promise<string> => {
  const toolId = getToolId(appName);

  const response = await fetch(
    `http://localhost:8000/api/stripe/create-checkout?tool_id=${encodeURIComponent(toolId)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
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
