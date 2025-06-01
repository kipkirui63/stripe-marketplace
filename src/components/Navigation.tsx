
import React, { useState } from 'react';
import { Home, Users, Settings, Phone, FileText, ShoppingCart, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './auth/LoginModal';

const Navigation = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Home', icon: Home, href: '#home' },
    { name: 'About', icon: Users, href: '#about' },
    { name: 'Services', icon: Settings, href: '#services' },
    { name: 'Contact', icon: Phone, href: '#contact' },
    { name: 'Assessment', icon: FileText, href: '#' },
    { name: 'Marketplace', icon: ShoppingCart, href: '/marketplace' },
  ];

  const handleScrollTo = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav className="w-full bg-white/90 backdrop-blur-sm border-b border-gray-200/50 fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full relative">
                  <div className="absolute inset-1 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">CrispAI</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                item.href.startsWith('/') ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => handleScrollTo(item.href)}
                    className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </button>
                )
              ))}
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{user.email}</span>
                  </span>
                  <button 
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium"
                >
                  Sign In
                </button>
              )}
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

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Navigation;
