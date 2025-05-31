
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const MarketplaceFooter = () => {
  return (
    <footer className="bg-blue-500 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* CrispAI Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">CrispAI</h3>
            <p className="text-blue-100 mb-6 leading-relaxed">
              The premier marketplace for digital applications and AI agents.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition-colors flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition-colors">
                  Developer Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition-colors">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition-colors">
                  License Information
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-400 mt-8 pt-8 text-center">
          <p className="text-blue-100">© 2025 CrispAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default MarketplaceFooter;
