
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE_URL = 'http://127.0.0.1:8000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      // Here you could verify the token with your backend if needed
      // For now, we'll assume the token is valid if it exists
      setUser({ id: 'user-id', email: 'user@example.com' });
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);
    console.log('API URL:', `${API_BASE_URL}/login`);
    setIsLoading(true);
    
    try {
      const requestBody = { email, password };
      console.log('Request body:', requestBody);
      
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      if (!response.ok) {
        console.error('Login failed with status:', response.status);
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { detail: `HTTP ${response.status}: ${responseText || 'Login failed'}` };
        }
        console.error('Login error data:', errorData);
        throw new Error(errorData.detail || errorData.message || `Login failed (${response.status})`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Invalid response format from server');
      }
      
      console.log('Parsed login response:', data);
      
      if (!data.token) {
        console.error('No token in response:', data);
        throw new Error('No token received from server');
      }

      const newToken = data.token;
      
      setToken(newToken);
      localStorage.setItem('token', newToken);
      setUser({ id: data.user_id || 'user-id', email });
      
      console.log('Login successful, token stored');
    } catch (error) {
      console.error('=== LOGIN ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    console.log('=== REGISTRATION ATTEMPT ===');
    console.log('Email:', email);
    console.log('API URL:', `${API_BASE_URL}/register`);
    setIsLoading(true);
    
    try {
      const requestBody = { email, password };
      console.log('Request body:', requestBody);
      
      console.log('Making fetch request...');
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response received!');
      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response URL:', response.url);
      
      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      if (!response.ok) {
        console.error('Registration failed with status:', response.status);
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { detail: `HTTP ${response.status}: ${responseText || 'Registration failed'}` };
        }
        console.error('Registration error data:', errorData);
        throw new Error(errorData.detail || errorData.message || `Registration failed (${response.status})`);
      }

      console.log('Registration successful, attempting auto-login...');
      // Auto-login after registration
      await login(email, password);
    } catch (error) {
      console.error('=== REGISTRATION ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('This looks like a network error - check if your backend server is running!');
      }
      console.error('Full error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
