
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  hasAccess: boolean;
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
  subscriptionExpiry: string | null;
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
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<string | null>(null);
  const { token, user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkSubscription = async () => {
    if (!token || !user) {
      setHasAccess(false);
      setSubscriptionExpiry(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-subscription?token=${encodeURIComponent(token)}`);
      const data = await response.json();
      
      console.log('Subscription check response:', data);
      
      setHasAccess(data.has_access || false);
      
      // If user has access, we can store expiry info if provided by backend
      if (data.has_access && data.subscription_end) {
        setSubscriptionExpiry(data.subscription_end);
      } else {
        setSubscriptionExpiry(null);
      }
      
      // If subscription expired, show alert and redirect away from agent pages
      if (!data.has_access && window.location.pathname.includes('agent')) {
        alert('Your subscription has expired. Please renew to continue accessing this app.');
        window.location.href = '/marketplace';
      }
      
    } catch (error) {
      console.error('Subscription check failed:', error);
      setHasAccess(false);
      setSubscriptionExpiry(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Setup periodic checking
  useEffect(() => {
    if (token && user) {
      // Initial check
      checkSubscription();
      
      // Set up periodic checking every 5 minutes
      intervalRef.current = setInterval(() => {
        checkSubscription();
      }, 5 * 60 * 1000); // 5 minutes
      
    } else {
      setHasAccess(false);
      setSubscriptionExpiry(null);
      
      // Clear interval when user logs out
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [token, user]);

  // Check subscription on page visibility change (when user comes back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && token && user) {
        checkSubscription();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [token, user]);

  return (
    <SubscriptionContext.Provider value={{ hasAccess, isLoading, checkSubscription, subscriptionExpiry }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
