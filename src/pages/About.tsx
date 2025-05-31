
import React from 'react';
import Navigation from '../components/Navigation';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your AI Partners in Innovation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Crisp AI is more than just a consultancy—we're your trusted partner in 
              transforming your business with cutting-edge AI solutions. From 
              automating tedious processes to creating intelligent chatbots and 
              leveraging Microsoft Copilot, our mission is simple: make your business 
              smarter, faster, and more innovative.
            </p>
          </div>

          {/* Innovation Section */}
          <div className="bg-white rounded-lg p-8 mb-16 shadow-sm">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <div className="w-6 h-6 text-blue-500">⭐</div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Smarter Solutions, Faster Results</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  We believe in the power of artificial intelligence to transform how businesses operate. 
                  Our team combines deep technical expertise with industry knowledge to deliver solutions 
                  that not only solve today's challenges but anticipate tomorrow's opportunities.
                </p>
              </div>
              <div className="lg:w-1/2">
                <img 
                  src="/lovable-uploads/9da10f5d-9bed-40ae-aff5-2124ff4ee4c2.png" 
                  alt="AI Innovation" 
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-gray-600">
                To democratize AI technology and make it accessible to businesses of all sizes, 
                helping them achieve unprecedented growth and efficiency.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation First</h3>
              <p className="text-gray-600">
                We stay at the forefront of AI technology, constantly exploring new possibilities 
                and pushing the boundaries of what's possible.
              </p>
            </div>
            <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🤝</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Partnership</h3>
            <p className="text-gray-600">
              We work closely with our clients as true partners, understanding their unique 
              challenges and crafting tailored solutions.
            </p>
          </div>

          {/* Team Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 mb-8">
              Our diverse team of AI experts, engineers, and consultants are passionate about 
              delivering exceptional results for our clients.
            </p>
            <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
              Contact Our Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
