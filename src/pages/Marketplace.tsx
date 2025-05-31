
import React from 'react';
import Navigation from '../components/Navigation';
import MarketplaceHero from '../components/MarketplaceHero';
import MarketplaceContent from '../components/MarketplaceContent';

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <MarketplaceHero />
      <MarketplaceContent />
    </div>
  );
};

export default Marketplace;
