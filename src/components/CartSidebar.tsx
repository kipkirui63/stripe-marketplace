
import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createCheckoutSession, getProductKey } from '../services/checkoutService';
import { useToast } from '@/hooks/use-toast';
import LoginModal from './auth/LoginModal';

interface App {
  id: number;
  name: string;
  description: string;
  price: string;
  freeTrialDays: string;
  rating: number;
  reviewCount: number;
  badge: string;
  badgeColor: string;
  icon: string;
  backgroundGradient: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: App[];
  onRemoveItem: (appId: number) => void;
}

const CartSidebar = ({ isOpen, onClose, cartItems, onRemoveItem }: CartSidebarProps) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, token } = useAuth();
  const { toast } = useToast();

  const totalPrice = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return total + price;
  }, 0);

  const handleCheckout = async () => {
    if (!user || !token) {
      setIsLoginModalOpen(true);
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

    setIsProcessing(true);
    try {
      // For now, we'll process the first item in the cart
      // You can modify this to handle multiple items or create a bundle
      const firstItem = cartItems[0];
      const productKey = getProductKey(firstItem.name);
      
      const checkoutUrl = await createCheckoutSession(token, productKey);
      
      // Open Stripe checkout in a new tab
      window.open(checkoutUrl, '_blank');
      
      toast({
        title: "Redirecting to Checkout",
        description: "Opening Stripe checkout in a new tab...",
      });
    } catch (error) {
      toast({
        title: "Checkout Error",
        description: error instanceof Error ? error.message : "Failed to start checkout process",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    // Automatically trigger checkout after successful login
    setTimeout(() => {
      handleCheckout();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>Your cart is empty</p>
              <p className="text-sm mt-2">Add some apps to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <img src={item.icon} alt={item.name} className="w-12 h-12 object-contain flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">{item.price}</span>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            {!user && (
              <p className="text-sm text-gray-600 text-center">
                You'll need to login to complete your purchase
              </p>
            )}
          </div>
        )}
      </div>
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default CartSidebar;
