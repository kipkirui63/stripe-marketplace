
import React from 'react';

const MarketplaceHero = () => {
  return (
    <div className="bg-blue-500 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find the Perfect<br />
              Digital Tools
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Discover and purchase powerful<br />
              applications and AI agents to enhance<br />
              your workflow
            </p>
            <button className="bg-white text-blue-500 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Browse Marketplace
            </button>
          </div>
          <div className="hidden lg:block">
            <div className="w-80 h-40 bg-white/10 rounded-lg flex items-center justify-center">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full relative">
                    <div className="absolute inset-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <span className="text-white text-3xl font-bold">CrispAI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHero;
