
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  hasAccess: boolean;
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscription must be used within a SubscriptionProvider');
  return context;
};

const API_BASE_URL = 'http://127.0.0.1:5500';

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useAuth();

  const checkSubscription = async () => {
    if (!token || !user) {
      setHasAccess(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-subscription?token=${encodeURIComponent(token)}`);
      const data = await response.json();
      setHasAccess(data.has_access || false);
    } catch (error) {
      console.error('Subscription check failed:', error);
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) {
      checkSubscription();
    } else {
      setHasAccess(false);
    }
  }, [token, user]);

  return (
    <SubscriptionContext.Provider value={{ hasAccess, isLoading, checkSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
