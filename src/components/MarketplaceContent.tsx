
import React, { useState } from 'react';
import MarketplaceFilters from './marketplace/MarketplaceFilters';
import AppsGrid from './marketplace/AppsGrid';
import CartSidebar from './CartSidebar';
import LoginModal from './auth/LoginModal';

interface CartItem {
  id: string;
  name: string;
  price: string;
}

const MarketplaceContent = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const tabs = ['All', 'Analytics', 'Writing', 'Recruitment', 'Business'];

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const exists = prev.find(cartItem => cartItem.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MarketplaceFilters
            activeTab={activeTab}
            tabs={tabs}
            cartItemCount={cartItems.length}
            onTabChange={setActiveTab}
            onCartClick={() => setIsCartOpen(true)}
            onSignInClick={() => setIsLoginModalOpen(true)}
          />
          
          <AppsGrid
            activeTab={activeTab}
            onAddToCart={addToCart}
          />
        </div>
      </div>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default MarketplaceContent;
