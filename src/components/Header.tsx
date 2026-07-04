/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Palette, Lock, Phone } from 'lucide-react';
import { ViewType, BusinessSettings } from '../types';

interface HeaderProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  settings: BusinessSettings;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

export default function Header({
  currentView,
  setView,
  settings,
  isAdminLoggedIn,
  onLogout
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'gallery', label: 'Art Gallery' },
    { id: 'categories', label: 'Categories' },
    { id: 'about', label: 'Our Story' },
    { id: 'contact', label: 'Enquiry & Contact' }
  ];

  const handleNavClick = (viewId: string) => {
    setView(viewId as ViewType);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-brand-cream/80 border-b border-brand-sand transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center space-x-2.5 cursor-pointer group"
            id="brand-logo"
          >
            <div className="w-8 h-8 bg-brand-terracotta rounded-full flex items-center justify-center text-white font-serif text-lg italic transition-transform duration-300 group-hover:rotate-12">
              P
            </div>
            <div>
              <span className="text-lg font-serif font-semibold tracking-tight uppercase text-brand-dark group-hover:text-brand-terracotta transition-colors duration-300">
                {settings.businessName}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-widest font-medium">
            {navItems.map((item) => {
              const isActive = currentView === item.id || (item.id === 'gallery' && currentView === 'product-details');
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`transition-colors duration-300 pb-1 cursor-pointer ${
                    isActive 
                      ? 'text-brand-terracotta border-b border-brand-terracotta' 
                      : 'text-brand-dark/80 hover:text-brand-terracotta'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop CTA / Admin Link */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Pallet%20and%20Color%2C%20I%20am%20browsing%20your%20showcase%20and%20would%20love%20to%20enquire%20about%20your%20custom%20artworks.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-brand-sage hover:bg-brand-sage/95 text-white font-sans text-[10px] font-bold uppercase tracking-widest hover:shadow-lg transition-all duration-300 flex items-center space-x-1.5"
              id="cta-whatsapp-header"
            >
              <Phone className="w-3 h-3" />
              <span>WhatsApp Chat</span>
            </a>

            {isAdminLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  id="nav-link-admin-dashboard"
                  onClick={() => setView('admin')}
                  className={`px-3 py-1.5 border border-brand-dark text-[10px] uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all cursor-pointer ${
                    currentView === 'admin' 
                      ? 'bg-brand-dark text-white' 
                      : 'text-brand-dark'
                  }`}
                  title="Admin Dashboard"
                >
                  Admin Portal
                </button>
                <button 
                  onClick={onLogout}
                  className="text-[10px] uppercase tracking-widest font-bold text-red-600 hover:text-red-700 hover:underline px-1 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                id="nav-link-admin-login"
                onClick={() => setView('admin')}
                className={`px-3 py-1.5 border border-brand-dark text-[10px] uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all cursor-pointer ${
                  currentView === 'admin' 
                    ? 'bg-brand-dark text-white' 
                    : 'text-brand-dark'
                }`}
                title="Admin Login"
              >
                Admin Portal
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3">
            {isAdminLoggedIn && currentView !== 'admin' && (
              <span className="text-[10px] bg-brand-terracotta/10 text-brand-terracotta px-2 py-0.5 rounded-full font-bold">
                Admin
              </span>
            )}
            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-brand-dark hover:text-brand-terracotta hover:bg-brand-sand focus:outline-none transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-cream border-t border-brand-sand animate-fadeIn" id="mobile-menu">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id || (item.id === 'gallery' && currentView === 'product-details');
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-xl font-sans text-base font-bold transition-all duration-200 ${
                    isActive 
                      ? 'bg-brand-terracotta/10 text-brand-terracotta' 
                      : 'text-brand-dark hover:bg-brand-sand hover:text-brand-terracotta'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            
            <div className="pt-4 border-t border-brand-sand/60 flex flex-col space-y-2.5 px-4">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Pallet%20and%20Color%2C%20I%20am%20browsing%20your%20showcase%20and%20would%20love%20to%20enquire%20about%20your%20custom%20artworks.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 w-full py-3 bg-brand-sage text-white font-sans text-sm font-bold uppercase tracking-wider rounded-xl shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>WhatsApp Chat</span>
              </a>
              
              <button
                id="mobile-nav-link-admin"
                onClick={() => handleNavClick('admin')}
                className={`flex items-center justify-center space-x-2 w-full py-3 rounded-xl font-sans text-sm font-bold border transition-colors ${
                  currentView === 'admin'
                    ? 'bg-brand-terracotta text-white border-brand-terracotta'
                    : 'border-brand-sand text-brand-dark hover:bg-brand-sand'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>{isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Portal'}</span>
              </button>
              
              {isAdminLoggedIn && (
                <button 
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-bold text-red-600 border border-transparent rounded-lg hover:bg-red-50"
                >
                  Logout Admin Session
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
