
import React, { useState } from 'react';
import MarketplaceFilters from './marketplace/MarketplaceFilters';
import AppsGrid from './marketplace/AppsGrid';
import CartSidebar from './CartSidebar';
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

const MarketplaceContent = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [cartItems, setCartItems] = useState<App[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userRatings, setUserRatings] = useState<{ [key: number]: number }>({});

  const tabs = ['All', 'Analytics', 'Writing', 'Recruitment', 'Business'];

  // Sample apps data with updated prices and trial periods
  const allApps: App[] = [
    {
      id: 1,
      name: 'Business Intelligence Agent',
      description: 'Advanced AI-powered analytics platform that transforms your data into actionable insights with real-time dashboards and predictive modeling.',
      price: '$19.99',
      freeTrialDays: '7-day free trial',
      rating: 0,
      reviewCount: 342,
      badge: 'Popular',
      badgeColor: 'bg-blue-500',
      icon: '/lovable-uploads/2284d8b0-4266-444a-8a5a-05b6701d561b.png',
      backgroundGradient: 'bg-gradient-to-br from-blue-400 to-purple-600'
    },
    {
      id: 2,
      name: 'AI Recruitment Assistant',
      description: 'Streamline your hiring process with AI-powered candidate screening, interview scheduling, and talent matching algorithms.',
      price: '$19.99',
      freeTrialDays: '7-day free trial',
      rating: 0,
      reviewCount: 189,
      badge: 'New',
      badgeColor: 'bg-green-500',
      icon: '/lovable-uploads/7b72063e-9cd7-4e40-8b15-390ea27053e1.png',
      backgroundGradient: 'bg-gradient-to-br from-green-400 to-blue-500'
    },
    {
      id: 3,
      name: 'CrispWrite',
      description: 'Professional writing assistant that helps create compelling content, from emails to reports, with AI-powered grammar and style suggestions.',
      price: '$89.99',
      freeTrialDays: '7-day free trial',
      rating: 0,
      reviewCount: 567,
      badge: 'Best Value',
      badgeColor: 'bg-orange-500',
      icon: '/lovable-uploads/7de4bd60-8000-41fa-a8e4-5637d9bfdf5c.png',
      backgroundGradient: 'bg-gradient-to-br from-orange-400 to-red-500'
    },
    {
      id: 4,
      name: 'SOP Assistant',
      description: 'Create, manage, and optimize Standard Operating Procedures with intelligent templates and collaborative editing features.',
      price: '$19.99',
      freeTrialDays: '7-day free trial',
      rating: 0,
      reviewCount: 234,
      badge: 'Trending',
      badgeColor: 'bg-purple-500',
      icon: '/lovable-uploads/9da10f5d-9bed-40ae-aff5-2124ff4ee4c2.png',
      backgroundGradient: 'bg-gradient-to-br from-purple-400 to-pink-500'
    },
    {
      id: 5,
      name: 'Resume Analyzer',
      description: 'Advanced resume screening tool that evaluates candidates against job requirements with detailed scoring and recommendations.',
      price: '$19.99',
      freeTrialDays: '7-day free trial',
      rating: 0,
      reviewCount: 445,
      badge: 'Essential',
      badgeColor: 'bg-indigo-500',
      icon: '/lovable-uploads/ee996b90-5709-4ed0-a535-014aa0accf98.png',
      backgroundGradient: 'bg-gradient-to-br from-indigo-400 to-blue-600'
    }
  ];

  const filteredApps = activeTab === 'All' 
    ? allApps 
    : allApps.filter(app => {
        const categoryMap: { [key: string]: string[] } = {
          'Analytics': ['Business Intelligence Agent'],
          'Writing': ['CrispWrite'],
          'Recruitment': ['AI Recruitment Assistant', 'Resume Analyzer'],
          'Business': ['SOP Assistant']
        };
        return categoryMap[activeTab]?.includes(app.name);
      });

  const addToCart = (item: App) => {
    setCartItems(prev => {
      const exists = prev.find(cartItem => cartItem.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleRate = (appId: number, rating: number) => {
    console.log(`Rating app ${appId} with ${rating} stars`);
    setUserRatings(prev => ({
      ...prev,
      [appId]: rating
    }));
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
            apps={filteredApps}
            userRatings={userRatings}
            onAddToCart={addToCart}
            onRate={handleRate}
          />
        </div>
      </div>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
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
