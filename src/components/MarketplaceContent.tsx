
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import CartSidebar from './CartSidebar';
import MarketplaceFilters from './marketplace/MarketplaceFilters';
import AppsGrid from './marketplace/AppsGrid';

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
  const [activeTab, setActiveTab] = useState('All Apps');
  const [cartItems, setCartItems] = useState<App[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userRatings, setUserRatings] = useState<{ [key: number]: number }>({});
  const { toast } = useToast();

  const apps: App[] = [
    {
      id: 1,
      name: 'Business Intelligence Agent',
      description: 'Intelligent agent that converts natural language queries into optimized SQL code instantly with AI-powered translation.',
      price: '$39.00',
      freeTrialDays: '7-day free trial',
      rating: 5.0,
      reviewCount: 28,
      badge: 'NEW',
      badgeColor: 'bg-purple-500',
      icon: '/lovable-uploads/7de4bd60-8000-41fa-a8e4-5637d9bfdf5c.png',
      backgroundGradient: 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400'
    },
    {
      id: 2,
      name: 'AI Recruitment Assistant',
      description: 'Streamlines talent acquisition with intelligent resume screening, candidate matching, and automated interview scheduling.',
      price: '$19.00',
      freeTrialDays: '7-day free trial',
      rating: 4.8,
      reviewCount: 42,
      badge: 'TRENDING',
      badgeColor: 'bg-orange-500',
      icon: '/lovable-uploads/2284d8b0-4266-444a-8a5a-05b6701d561b.png',
      backgroundGradient: 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400'
    },
    {
      id: 3,
      name: 'CrispWrite',
      description: 'Advanced content creation tool that generates high-quality, SEO-optimized articles, blog posts, and marketing copy.',
      price: '$89.99',
      freeTrialDays: '7-day free trial',
      rating: 4.9,
      reviewCount: 124,
      badge: 'BESTSELLER',
      badgeColor: 'bg-orange-400',
      icon: '/lovable-uploads/e51e943f-bfe0-4391-979e-5c0566e7fa23.png',
      backgroundGradient: 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400'
    },
    {
      id: 4,
      name: 'SOP Assistant',
      description: 'Automated documentation assistant that creates, updates, and maintains standard operating procedures with minimal input.',
      price: '$19.00',
      freeTrialDays: '7-day free trial',
      rating: 4.7,
      reviewCount: 35,
      badge: 'NEW',
      badgeColor: 'bg-purple-500',
      icon: '/lovable-uploads/7b72063e-9cd7-4e40-8b15-390ea27053e1.png',
      backgroundGradient: 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400'
    },
    {
      id: 5,
      name: 'Resume Analyzer',
      description: 'Professional resume evaluation tool that provides detailed feedback, improvement suggestions, and ATS compatibility assessment.',
      price: '$19.00',
      freeTrialDays: '7-day free trial',
      rating: 4.5,
      reviewCount: 67,
      badge: 'POPULAR',
      badgeColor: 'bg-green-500',
      icon: '/lovable-uploads/ee996b90-5709-4ed0-a535-014aa0accf98.png',
      backgroundGradient: 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400'
    }
  ];

  const tabs = ['All Apps', 'Popular', 'New'];

  const addToCart = (app: App) => {
    const isAlreadyInCart = cartItems.some(item => item.id === app.id);
    if (!isAlreadyInCart) {
      setCartItems([...cartItems, app]);
      toast({
        title: "Added to Cart",
        description: `${app.name} has been added to your cart.`,
      });
    } else {
      toast({
        title: "Already in Cart",
        description: `${app.name} is already in your cart.`,
      });
    }
  };

  const removeFromCart = (appId: number) => {
    setCartItems(cartItems.filter(item => item.id !== appId));
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });
  };

  const handleRating = (appId: number, rating: number) => {
    setUserRatings({ ...userRatings, [appId]: rating });
    toast({
      title: "Rating Submitted",
      description: `You rated this app ${rating} stars.`,
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MarketplaceFilters
          activeTab={activeTab}
          tabs={tabs}
          cartItemCount={cartItems.length}
          onTabChange={setActiveTab}
          onCartClick={() => setIsCartOpen(true)}
        />

        <AppsGrid
          apps={apps}
          userRatings={userRatings}
          onAddToCart={addToCart}
          onRate={handleRating}
        />
      </div>

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
      />
    </>
  );
};

export default MarketplaceContent;
