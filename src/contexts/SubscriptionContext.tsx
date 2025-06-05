
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
    console.log('🔄 Starting subscription check...');
    console.log('User:', user ? 'logged in' : 'not logged in');
    console.log('Token:', token ? 'exists' : 'missing');
    
    if (!token || !user) {
      console.log('❌ No token or user - setting access to false');
      setHasAccess(false);
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
      
      const newHasAccess = data.has_access || false;
      console.log('🔐 Setting hasAccess to:', newHasAccess);
      console.log('🔐 Previous hasAccess was:', hasAccess);
      
      setHasAccess(newHasAccess);
      
      // If user has access, we can store expiry info if provided by backend
      if (newHasAccess && data.subscription_end) {
        console.log('📅 Setting subscription expiry:', data.subscription_end);
        setSubscriptionExpiry(data.subscription_end);
      } else {
        setSubscriptionExpiry(null);
      }
      
      // If subscription expired, show alert and redirect away from agent pages
      if (!newHasAccess && window.location.pathname.includes('agent')) {
        alert('Your subscription has expired. Please renew to continue accessing this app.');
        window.location.href = '/marketplace';
      }
      
    } catch (error) {
      console.error('💥 Subscription check failed:', error);
      setHasAccess(false);
      setSubscriptionExpiry(null);
    } finally {
      setIsLoading(false);
      console.log('✅ Subscription check completed - Final hasAccess:', hasAccess);
    }
  };

  // Check for Stripe success redirect
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('status') === 'success' || queryParams.get('success') === 'true') {
      console.log('🎉 Detected successful payment redirect - checking subscription');
      setTimeout(() => {
        checkSubscription();
      }, 1000); // Small delay to ensure backend is updated
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
        console.log('👁️ Page visibility changed, checking subscription');
        checkSubscription();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [token, user]);

  console.log('🎯 Current subscription state - hasAccess:', hasAccess, 'isLoading:', isLoading);

  return (
    <SubscriptionContext.Provider value={{ hasAccess, isLoading, checkSubscription, subscriptionExpiry }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
