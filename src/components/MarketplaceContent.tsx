
import React, { useState } from 'react';
import { Search, ShoppingCart, Home } from 'lucide-react';

const MarketplaceContent = () => {
  const [activeTab, setActiveTab] = useState('All Apps');

  const apps = [
    {
      id: 1,
      name: 'Business Intelligence',
      description: 'Advanced analytics platform',
      badge: 'NEW',
      badgeColor: 'bg-purple-500',
      icon: '📊',
      color: 'bg-blue-100'
    },
    {
      id: 2,
      name: 'User Profile Manager',
      description: 'Comprehensive user management',
      badge: 'TRENDING',
      badgeColor: 'bg-orange-500',
      icon: '👤',
      color: 'bg-blue-100'
    },
    {
      id: 3,
      name: 'CrispWrite',
      description: 'AI-powered writing assistant',
      badge: 'BESTSELLER',
      badgeColor: 'bg-orange-400',
      icon: '✍️',
      color: 'bg-blue-100'
    }
  ];

  const tabs = ['All Apps', 'Popular', 'New'];

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
          <div key={app.id} className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Badge */}
            <div className={`absolute top-4 right-4 ${app.badgeColor} text-white text-xs font-bold px-2 py-1 rounded`}>
              {app.badge}
            </div>
            
            {/* App Icon and Info */}
            <div className="flex items-start space-x-4">
              <div className={`w-16 h-16 ${app.color} rounded-lg flex items-center justify-center text-2xl`}>
                {app.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{app.name}</h3>
                <p className="text-gray-600 text-sm">{app.description}</p>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="mt-4">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceContent;
