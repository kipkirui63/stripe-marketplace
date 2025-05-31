
import React, { useState } from 'react';
import { Search, ShoppingCart, Home, Star, ThumbsUp } from 'lucide-react';

const MarketplaceContent = () => {
  const [activeTab, setActiveTab] = useState('All Apps');

  const apps = [
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
      icon: '📊',
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
      icon: '👤',
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
      icon: '✍️',
      backgroundGradient: 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400'
    }
  ];

  const tabs = ['All Apps', 'Popular', 'New'];

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
            />
          </div>
          <button className="p-2 text-gray-600 hover:text-blue-500">
            <Home className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-blue-500">
            <ShoppingCart className="w-5 h-5" />
          </button>
          <button className="text-gray-600 hover:text-blue-500 font-medium">
            Sign In
          </button>
        </div>
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div key={app.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* App Header with Image/Icon */}
            <div className={`relative h-48 ${app.backgroundGradient} flex items-center justify-center`}>
              <div className={`absolute top-4 right-4 ${app.badgeColor} text-white text-xs font-bold px-2 py-1 rounded`}>
                {app.badge}
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{app.icon}</div>
                  <div className="text-xl font-bold text-gray-900">{app.name}</div>
                </div>
              </div>
            </div>
            
            {/* App Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-xl text-gray-900">{app.name}</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{app.price}</div>
                  <div className="text-sm text-green-600">{app.freeTrialDays}</div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{app.description}</p>
              
              {/* Rating and Reviews */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {renderStars(app.rating)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{app.rating} ({app.reviewCount})</span>
                </div>
                <button className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 text-sm">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Rate</span>
                </button>
              </div>
              
              {/* Action Button */}
              <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceContent;
