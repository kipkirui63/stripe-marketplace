
import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

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

interface AppCardProps {
  app: App;
  userRating: number;
  onAddToCart: (app: App) => void;
  onRate: (appId: number, rating: number) => void;
}

const AppCard = ({ app, userRating, onAddToCart, onRate }: AppCardProps) => {
  const renderStars = (rating: number, interactive: boolean = false) => {
    const stars = [];
    const currentRating = interactive ? userRating : rating;

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= currentRating;
      
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 transition-colors ${
            isFilled 
              ? 'fill-yellow-400 text-yellow-400' 
              : interactive 
                ? 'text-gray-300 hover:text-yellow-400 cursor-pointer' 
                : 'text-gray-300'
          }`}
          onClick={interactive ? () => onRate(app.id, i) : undefined}
        />
      );
    }

    return stars;
  };

  // Calculate dynamic review count - if user has rated, add 1 to base count
  const displayReviewCount = userRating > 0 ? app.reviewCount + 1 : app.reviewCount;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* App Header with Image/Icon */}
      <div className={`relative h-64 ${app.backgroundGradient} flex items-center justify-center p-8`}>
        <div className={`absolute top-4 right-4 ${app.badgeColor} text-white text-xs font-bold px-2 py-1 rounded`}>
          {app.badge}
        </div>
        <div className="bg-white rounded-xl p-8 shadow-sm w-full h-full flex items-center justify-center">
          <img src={app.icon} alt={app.name} className="w-32 h-32 object-contain" />
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
        
        {/* Rating - Interactive Stars */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex">
            {renderStars(userRating || 0, true)}
          </div>
          <span className="text-sm text-gray-600">({displayReviewCount})</span>
        </div>
        
        {/* Action Button */}
        <button 
          onClick={() => onAddToCart(app)}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default AppCard;
