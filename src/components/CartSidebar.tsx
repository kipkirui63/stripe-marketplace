import React, { useState } from 'react';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { createCheckoutSession, getProductKey } from '../services/checkoutService';
import { useToast } from '@/hooks/use-toast';

interface App {
  id: number;
  name: string;
  price: string;
  icon: string;
  isComingSoon?: boolean;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: App[];
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
}

const CartSidebar = ({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }: CartSidebarProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, token } = useAuth();
  const { hasAccess, checkSubscription } = useSubscription();
  const { toast } = useToast();

  const handleProceedToCheckout = async () => {
    console.log('Checkout clicked - User:', !!user, 'Token:', !!token, 'Has Access:', hasAccess);

    if (!user || !token) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed with checkout.",
        variant: "destructive",
      });
      return;
    }

    // Check subscription status first to prevent double subscriptions
    console.log('🔍 Checking current subscription status before checkout...');
    await checkSubscription();
    
    // Wait a moment for state to update, then check hasAccess
    setTimeout(async () => {
      if (hasAccess) {
        toast({
          title: "Already Subscribed",
          description: "You already have access to all apps. No need to purchase again!",
        });
        return;
      }

      if (cartItems.length === 0) {
        toast({
          title: "Empty Cart",
          description: "Please add items to your cart before checkout.",
          variant: "destructive",
        });
        return;
      }

      // Filter out coming soon items
      const availableItems = cartItems.filter(item => !item.isComingSoon);
      
      if (availableItems.length === 0) {
        toast({
          title: "No Available Items",
          description: "All items in your cart are coming soon.",
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);

      try {
        // Use the first available item for checkout
        const firstItem = availableItems[0];
        const productKey = getProductKey(firstItem.name);
        
        console.log('Creating checkout session for:', firstItem.name, 'Product key:', productKey);
        
        const checkoutUrl = await createCheckoutSession(token, productKey);
        
        console.log('Checkout URL received:', checkoutUrl);
        
        // Open Stripe checkout in a new tab
        const checkoutWindow = window.open(checkoutUrl, '_blank');
        
        // Clear cart immediately after opening checkout
        onClearCart();
        
        // Close cart sidebar
        onClose();
        
        // Monitor the checkout window and refresh subscription when it closes
        const checkWindowClosed = setInterval(async () => {
          if (checkoutWindow && checkoutWindow.closed) {
            clearInterval(checkWindowClosed);
            console.log('Checkout window closed, checking subscription status...');
            
            // Multiple subscription checks for reliability
            await checkSubscription();
            setTimeout(async () => {
              console.log('🔄 Second subscription check after window close');
              await checkSubscription();
            }, 2000);
            setTimeout(async () => {
              console.log('🔄 Final subscription check after window close');
              await checkSubscription();
            }, 5000);
          }
        }, 1000);
        
        toast({
          title: "Redirecting to Checkout",
          description: "Opening Stripe checkout in a new tab...",
        });
        
      } catch (error) {
        console.error('Checkout error details:', error);
        
        let errorMessage = 'An unexpected error occurred during checkout.';
        
        if (error instanceof Error) {
          if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
            errorMessage = 'Payment service is currently unavailable. Please try again later.';
          } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Network error. Please check your connection and try again.';
          } else {
            errorMessage = error.message;
          }
        }
        
        toast({
          title: "Checkout Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }, 500); // Give checkSubscription time to update state
  };

  const handleManualRefresh = async () => {
    console.log('Manual subscription refresh triggered');
    toast({
      title: "Refreshing Subscription",
      description: "Checking your subscription status...",
    });
    
    try {
      await checkSubscription();
      toast({
        title: "Subscription Updated",
        description: "Your subscription status has been refreshed.",
      });
    } catch (error) {
      console.error('Manual refresh error:', error);
      toast({
        title: "Refresh Failed",
        description: "Failed to check subscription status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const total = cartItems
    .filter(item => !item.isComingSoon)
    .reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Your cart is empty</p>
                {user && (
                  <button
                    onClick={handleManualRefresh}
                    className="mt-4 text-blue-500 hover:text-blue-600 text-sm underline"
                  >
                    Check Subscription Status
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <img src={item.icon} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.name}</h3>
                      <p className="text-blue-600 font-semibold">{item.price}</p>
                      {item.isComingSoon && (
                        <p className="text-gray-500 text-xs">Coming Soon</p>
                      )}
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between items-center font-semibold">
                <span>Total:</span>
                <span className="text-xl text-blue-600">${total.toFixed(2)}</span>
              </div>
              
              {hasAccess && (
                <div className="text-center text-green-600 text-sm font-medium">
                  ✓ You already have access to all apps
                </div>
              )}
              
              <div className="space-y-2">
                <button
                  onClick={handleProceedToCheckout}
                  disabled={isProcessing || cartItems.length === 0 || cartItems.every(item => item.isComingSoon)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isProcessing || cartItems.length === 0 || cartItems.every(item => item.isComingSoon)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : hasAccess
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isProcessing 
                    ? 'Processing...' 
                    : hasAccess 
                    ? 'Already Subscribed'
                    : 'Proceed to Checkout'
                  }
                </button>
                
                {user && (
                  <button
                    onClick={handleManualRefresh}
                    className="w-full py-2 px-4 rounded-lg font-medium text-blue-500 border border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    Refresh Subscription Status
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
