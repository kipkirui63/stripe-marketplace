
import React from 'react';
import { Home, Users, Settings, Phone, FileText, ShoppingCart, LogOut } from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { name: 'Home', icon: Home, href: '#' },
    { name: 'About', icon: Users, href: '#' },
    { name: 'Services', icon: Settings, href: '#' },
    { name: 'Contact', icon: Phone, href: '#' },
    { name: 'Assessment', icon: FileText, href: '#' },
    { name: 'Marketplace', icon: ShoppingCart, href: '#' },
  ];

  return (
    <nav className="w-full bg-white/90 backdrop-blur-sm border-b border-gray-200/50 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full relative">
                <div className="absolute inset-1 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900">CrispAI</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors duration-200">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-blue-500">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
