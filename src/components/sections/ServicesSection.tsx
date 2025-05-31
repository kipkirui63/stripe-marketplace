
import React, { useState } from 'react';

const ServicesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const services = [
    {
      icon: '🛒',
      title: 'AI for Sales',
      description: 'Transform your sales process with AI-powered insights and automation.',
      benefits: [
        'Reduce sales cycle by up to 40%',
        'Increase conversion rates by 35%',
        'Automate lead qualification and scoring',
        'Predict customer lifetime value'
      ],
      useCases: [
        'AI-powered sales forecasting',
        'Intelligent lead prioritization',
        'Automated follow-up sequences',
        'Smart deal insights and recommendations'
      ]
    },
    {
      icon: '👥',
      title: 'AI for Marketing',
      description: 'Revolutionize your marketing strategies with AI-driven insights.',
      benefits: [
        'Increase marketing ROI by 30%',
        'Personalize customer experiences',
        'Optimize campaign performance',
        'Predict market trends'
      ],
      useCases: [
        'Dynamic content personalization',
        'Predictive audience targeting',
        'AI-powered A/B testing',
        'Automated social media optimization'
      ]
    },
    {
      icon: '💬',
      title: 'AI for Customer Support',
      description: 'Deliver exceptional customer service with AI assistance.',
      benefits: [
        'Reduce response time by 60%',
        'Available 24/7/365',
        'Handle multiple queries simultaneously',
        'Improve customer satisfaction'
      ],
      useCases: [
        'Intelligent chatbots',
        'Automated ticket routing',
        'Sentiment analysis',
        'Predictive customer needs'
      ]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(services.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(services.length / 3)) % Math.ceil(services.length / 3));
  };

  const getVisibleServices = () => {
    const startIndex = currentSlide * 3;
    return services.slice(startIndex, startIndex + 3);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-500 mb-6">
          AI Solutions for Every Industry
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover how our comprehensive AI services can transform your business operations 
          across sales, marketing, customer support, IT operations, and human resources.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {services.map((service, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <span className="text-2xl">{service.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-blue-500">{service.title}</h3>
            </div>
            
            <p className="text-gray-600 mb-6">{service.description}</p>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Key Benefits:</h4>
              <ul className="space-y-2">
                {service.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600">
                    <span className="text-blue-500 mr-2">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Use Cases:</h4>
              <ul className="space-y-2">
                {service.useCases.map((useCase, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600">
                    <span className="text-blue-500 mr-2">•</span>
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gray-50 rounded-lg p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Contact us today to discuss how our AI solutions can help your organization 
          achieve its goals and stay ahead of the competition.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
            Get Started
          </button>
          <button className="border border-blue-500 text-blue-500 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium">
            Schedule Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
