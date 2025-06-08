import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";

interface SubscriptionContextType {
  purchasedApps: string[];
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
  hasPurchased: (appName: string) => boolean;
  subscriptionExpiry: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context)
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  return context;
};

const API_BASE_URL = "http://127.0.0.1:8000";

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [purchasedApps, setPurchasedApps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<string | null>(
    null
  );
  const { token, user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const hasPurchased = (appName: string) => {
    return purchasedApps.includes(appName);
  };

  const checkSubscription = async () => {
    console.log("🔄 Starting subscription check...");
    if (!token || !user) {
      setPurchasedApps([]);
      setSubscriptionExpiry(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/check-subscription/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.has_access && Array.isArray(data.tools)) {
        const allApps = [
          "Business Intelligence Agent", // tool_id = 1
          "AI Recruitment Assistant",    // tool_id = 2
          "CrispWrite",                 // tool_id = 3
          "SOP Assistant",              // tool_id = 4
          "Resume Analyzer",            // tool_id = 5
        ];

        const mappedApps = data.tools
          .map((toolId: number) => allApps[toolId - 1])
          .filter(Boolean);

        setPurchasedApps(mappedApps);

        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + 1);
        setSubscriptionExpiry(futureDate.toISOString());
      } else {
        setPurchasedApps([]);
        setSubscriptionExpiry(null);
      }
    } catch (error) {
      console.error("💥 Subscription check failed:", error);
      setPurchasedApps([]);
      setSubscriptionExpiry(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isPaymentSuccess =
      urlParams.get("status") === "success" ||
      urlParams.get("success") === "true" ||
      urlParams.get("session_id");

    if (isPaymentSuccess && token && user) {
      window.history.replaceState({}, document.title, window.location.pathname);
      checkSubscription().then(() => {
        setTimeout(() => {
          checkSubscription();
        }, 3000);
      });
    }
  }, [token, user]);

  useEffect(() => {
    if (token && user) {
      checkSubscription();
      intervalRef.current = setInterval(() => {
        checkSubscription();
      }, 5 * 60 * 1000);
    } else {
      setPurchasedApps([]);
      setSubscriptionExpiry(null);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [token, user]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && token && user) {
        checkSubscription();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [token, user]);

  return (
    <SubscriptionContext.Provider
      value={{
        purchasedApps,
        isLoading,
        checkSubscription,
        hasPurchased,
        subscriptionExpiry,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
