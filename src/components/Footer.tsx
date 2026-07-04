/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Phone, Instagram, Facebook, Palette, Heart, ShieldCheck } from 'lucide-react';
import { ViewType, BusinessSettings } from '../types';

interface FooterProps {
  setView: (view: ViewType) => void;
  settings: BusinessSettings;
}

export default function Footer({ setView, settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8 mt-auto border-t-4 border-brand-terracotta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('home')}>
              <div className="w-8 h-8 rounded-full bg-brand-terracotta flex items-center justify-center text-white">
                <Palette className="w-4.5 h-4.5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white hover:text-brand-dustypink transition-colors">
                {settings.businessName}
              </span>
            </div>
            <p className="text-sm text-gray-300 font-sans leading-relaxed">
              Crafting dreams into glossy resin arts, fine-textured canvases, and customized gifts. Hand-poured with love, positive energy, and meticulous detail in our home studio.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a 
                href={settings.instagramLink || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-brand-dustypink hover:text-brand-dark flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a 
                href={settings.facebookLink || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-brand-dustypink hover:text-brand-dark flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-brand-dustypink tracking-wide border-b border-gray-800 pb-2">
              Explore Gallery
            </h4>
            <ul className="space-y-2.5 font-sans text-sm text-gray-300">
              <li>
                <button onClick={() => setView('home')} className="hover:text-brand-dustypink hover:translate-x-1 transition-all cursor-pointer">
                  Featured Home
                </button>
              </li>
              <li>
                <button onClick={() => setView('gallery')} className="hover:text-brand-dustypink hover:translate-x-1 transition-all cursor-pointer">
                  Entire Showcase
                </button>
              </li>
              <li>
                <button onClick={() => setView('categories')} className="hover:text-brand-dustypink hover:translate-x-1 transition-all cursor-pointer">
                  Art Categories
                </button>
              </li>
              <li>
                <button onClick={() => setView('about')} className="hover:text-brand-dustypink hover:translate-x-1 transition-all cursor-pointer">
                  Our Creative Story
                </button>
              </li>
              <li>
                <button onClick={() => setView('contact')} className="hover:text-brand-dustypink hover:translate-x-1 transition-all cursor-pointer">
                  Custom Orders & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-brand-dustypink tracking-wide border-b border-gray-800 pb-2">
              Get in Touch
            </h4>
            <ul className="space-y-3 font-sans text-sm text-gray-300">
              <li className="flex items-start space-x-2.5">
                <Mail className="w-4.5 h-4.5 text-brand-dustypink shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Email Address</p>
                  <a 
                    href={`mailto:${settings.email}`} 
                    className="hover:text-brand-dustypink break-all font-medium transition-colors"
                  >
                    {settings.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2.5">
                <Phone className="w-4.5 h-4.5 text-brand-dustypink shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">WhatsApp / Call</p>
                  <a 
                    href={`https://wa.me/${settings.whatsappNumber}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-brand-dustypink font-medium transition-colors"
                  >
                    +91 {settings.whatsappNumber}
                  </a>
                </div>
              </li>
              <li className="text-xs text-gray-400 leading-relaxed pt-1">
                We handle custom gift orders, resin art flower preservation, custom painting commissions, and interior decor partnerships.
              </li>
            </ul>
          </div>

          {/* Column 4: Quality & Delivery Guarantee */}
          <div className="space-y-4 bg-gray-900/40 p-4.5 rounded-2xl border border-gray-800">
            <div className="flex items-center space-x-2 text-brand-dustypink">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <h4 className="font-serif text-base font-bold tracking-wide">
                Artisanal Guarantee
              </h4>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              {settings.deliveryNote}
            </p>
            <div className="pt-2 text-xs text-brand-dustypink italic flex items-center space-x-1">
              <span>Made with love & care</span>
              <Heart className="w-3.5 h-3.5 fill-current text-brand-terracotta inline" />
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 font-sans">
          <p>© {currentYear} {settings.businessName}. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button onClick={() => setView('about')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => setView('contact')} className="hover:text-white transition-colors">Delivery Terms</button>
            <button onClick={() => setView('admin')} className="hover:text-white transition-colors flex items-center space-x-1">
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
