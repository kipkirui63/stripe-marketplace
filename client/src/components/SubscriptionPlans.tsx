import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  discount: number;
  features: string[];
  isPopular?: boolean;
}

interface SubscriptionPlansProps {
  onSelectPlan: (planId: string, isYearly: boolean) => void;
}

const SubscriptionPlans = ({ onSelectPlan }: SubscriptionPlansProps) => {
  const [isYearly, setIsYearly] = useState(false);

  const plans: SubscriptionPlan[] = [
    {
      id: '1-month',
      name: '1 Month',
      monthlyPrice: 19.99,
      yearlyPrice: 19.99,
      discount: 0,
      features: [
        'Access to all AI tools',
        'Priority support',
        'Monthly updates',
        'Basic analytics'
      ]
    },
    {
      id: '3-month',
      name: '3 Months',
      monthlyPrice: 19.99,
      yearlyPrice: 17.99,
      discount: 10,
      features: [
        'Access to all AI tools',
        'Priority support',
        'Monthly updates',
        'Advanced analytics',
        'Custom integrations'
      ]
    },
    {
      id: '6-month',
      name: '6 Months',
      monthlyPrice: 19.99,
      yearlyPrice: 16.99,
      discount: 15,
      features: [
        'Access to all AI tools',
        'Priority support',
        'Monthly updates',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated account manager'
      ],
      isPopular: true
    },
    {
      id: '12-month',
      name: '12 Months',
      monthlyPrice: 19.99,
      yearlyPrice: 14.99,
      discount: 25,
      features: [
        'Access to all AI tools',
        'Priority support',
        'Monthly updates',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated account manager',
        'Early access to new features'
      ]
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const calculateTotalPrice = (plan: SubscriptionPlan) => {
    const basePrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const months = parseInt(plan.id.split('-')[0]);
    return basePrice * months;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-gray-600 mb-6">Select the perfect plan for your business needs</p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <Label htmlFor="billing-toggle" className="text-sm font-medium text-gray-700">
            Billed monthly
          </Label>
          <div className="relative flex items-center">
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
          <Label htmlFor="billing-toggle" className="text-sm font-medium text-gray-700">
            Billed yearly
          </Label>
          {isYearly && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              Save 20%
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
          const totalPrice = calculateTotalPrice(plan);
          const savings = isYearly && plan.discount > 0 ? plan.monthlyPrice - plan.yearlyPrice : 0;
          
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg shadow-lg border-2 p-6 ${
                plan.isPopular ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                
                <div className="mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(currentPrice)}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                
                {isYearly && plan.discount > 0 && (
                  <div className="space-y-1">
                    <div className="text-sm text-green-600 font-medium">
                      Save {formatPrice(savings)}/month
                    </div>
                    <div className="text-sm text-gray-500">
                      Total: {formatPrice(totalPrice)}
                    </div>
                  </div>
                )}
                
                {plan.discount > 0 && (
                  <Badge variant="outline" className="mt-2 text-green-600 border-green-200">
                    {plan.discount}% off
                  </Badge>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => onSelectPlan(plan.id, isYearly)}
                className={`w-full ${
                  plan.isPopular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Choose {plan.name}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          All plans include 24/7 support and a 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;