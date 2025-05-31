
import React from 'react';

const Hero = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Logo and Title */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mr-4">
              <div className="w-10 h-10 bg-white rounded-full relative">
                <div className="absolute inset-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-2">
                Crisp AI
              </h1>
              <p className="text-xl text-blue-500 font-medium">
                Artificial Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Blue divider line */}
        <div className="w-full h-1 bg-blue-500 mb-12 mx-auto"></div>

        {/* Description */}
        <div className="mb-16 max-w-4xl mx-auto">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
            No longer just a futuristic concept—AI is here to revolutionize your business. Whether you're in 
            sales, marketing, healthcare, or government, Crisp AI helps you unlock the true potential of 
            Artificial Intelligence.
          </p>
          
          <p className="text-lg md:text-xl text-gray-700 font-medium">
            AI isn't one-size-fits-all, and neither are we.
          </p>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[280px]">
            Get Started with Crisp AI Today!
          </button>
          
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[280px]">
            Multi-Agent Resume Analyzer
          </button>
          
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[280px]">
            AI Recruitment Assistant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
