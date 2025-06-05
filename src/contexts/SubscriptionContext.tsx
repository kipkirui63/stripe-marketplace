
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  purchasedApps: string[];
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
  hasPurchased: (appName: string) => boolean;
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
  const [purchasedApps, setPurchasedApps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<string | null>(null);
  const { token, user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const hasPurchased = (appName: string) => {
    return purchasedApps.includes(appName);
  };

  const checkSubscription = async () => {
    console.log('🔄 Starting subscription check...');
    console.log('User:', user ? 'logged in' : 'not logged in');
    console.log('Token:', token ? 'exists' : 'missing');
    
    if (!token || !user) {
      console.log('❌ No token or user - clearing purchased apps');
      setPurchasedApps([]);
      setSubscriptionExpiry(null);
      return;
    }

    setIsLoading(true);
    try {
      console.log('📡 Making API call to check subscription...');
      const response = await fetch(`${API_BASE_URL}/auth/check-subscription?token=${encodeURIComponent(token)}`);
      
      console.log('📋 Response status:', response.status);
      
      if (!response.ok) {
        console.error('❌ Response not OK:', response.status, response.statusText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Subscription check response:', data);
      
      // Expect the backend to return purchased_apps array instead of has_access
      const newPurchasedApps = data.purchased_apps || [];
      console.log('🔐 Setting purchasedApps from', purchasedApps, 'to', newPurchasedApps);
      
      setPurchasedApps(newPurchasedApps);
      
      if (data.subscription_end) {
        console.log('📅 Setting subscription expiry:', data.subscription_end);
        setSubscriptionExpiry(data.subscription_end);
      } else {
        setSubscriptionExpiry(null);
      }
      
    } catch (error) {
      console.error('💥 Subscription check failed:', error);
      setPurchasedApps([]);
      setSubscriptionExpiry(null);
    } finally {
      setIsLoading(false);
      console.log('✅ Subscription check completed');
    }
  };

  // Check for Stripe success redirect immediately on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isPaymentSuccess = urlParams.get('status') === 'success' || 
                            urlParams.get('success') === 'true' ||
                            urlParams.get('session_id');
    
    if (isPaymentSuccess && token && user) {
      console.log('🎉 Payment success detected in URL - checking subscription immediately');
      
      // Clear the URL parameters immediately
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Check subscription immediately, then again after a delay
      checkSubscription().then(() => {
        console.log('💡 First subscription check completed, scheduling follow-up check');
        setTimeout(() => {
          console.log('🔄 Follow-up subscription check after payment');
          checkSubscription();
        }, 3000);
      });
    }
  }, [token, user]);

  // Setup periodic checking
  useEffect(() => {
    if (token && user) {
      console.log('🚀 User and token available, starting subscription monitoring');
      // Initial check
      checkSubscription();
      
      // Set up periodic checking every 5 minutes
      intervalRef.current = setInterval(() => {
        console.log('⏰ Periodic subscription check triggered');
        checkSubscription();
      }, 5 * 60 * 1000); // 5 minutes
      
    } else {
      console.log('🔒 No user or token, clearing access');
      setPurchasedApps([]);
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
        console.log('👁️ Page visibility changed, checking subscription');
        checkSubscription();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [token, user]);

  console.log('🎯 Current subscription state - purchasedApps:', purchasedApps, 'isLoading:', isLoading);

  return (
    <SubscriptionContext.Provider value={{ 
      purchasedApps, 
      isLoading, 
      checkSubscription, 
      hasPurchased, 
      subscriptionExpiry 
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
