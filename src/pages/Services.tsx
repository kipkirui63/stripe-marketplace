
import React, { useState } from 'react';
import Navigation from '../components/Navigation';

const Services = () => {
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
    },
    {
      icon: '💾',
      title: 'AI for IT Operations',
      description: 'Optimize your IT infrastructure with intelligent automation.',
      benefits: [
        'Reduce downtime by 70%',
        'Automate routine maintenance',
        'Enhance security posture',
        'Optimize resource allocation'
      ],
      useCases: [
        'Predictive maintenance',
        'Automated incident response',
        'Security threat detection',
        'Resource optimization'
      ]
    },
    {
      icon: '👤',
      title: 'AI for Human Resources',
      description: 'Transform your HR processes with AI-powered solutions.',
      benefits: [
        'Reduce hiring time by 50%',
        'Improve candidate quality',
        'Enhance employee engagement',
        'Optimize workforce planning'
      ],
      useCases: [
        'Resume screening and ranking',
        'Automated interview scheduling',
        'Employee sentiment analysis',
        'Workforce analytics'
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
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

          {/* Services Carousel */}
          <div className="relative mb-8">
            <div className="flex justify-between items-center mb-8">
              <button 
                onClick={prevSlide}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                ←
              </button>
              <button 
                onClick={nextSlide}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                →
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {getVisibleServices().map((service, index) => (
                <div key={index} className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
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

            {/* Pagination dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(services.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white rounded-lg p-8 shadow-sm">
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
      </div>
    </div>
  );
};

export default Services;
