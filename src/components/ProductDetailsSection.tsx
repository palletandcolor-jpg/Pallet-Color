/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Phone, Mail, Sparkles, Compass, ShieldCheck, Heart, FileText } from 'lucide-react';
import { Product, Category, BusinessSettings } from '../types';

interface ProductDetailsSectionProps {
  product: Product;
  categories: Category[];
  settings: BusinessSettings;
  setView: (view: 'gallery' | 'contact') => void;
}

export default function ProductDetailsSection({
  product,
  categories,
  settings,
  setView
}: ProductDetailsSectionProps) {
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const categoryObj = categories.find(c => c.id === product.categoryId);

  // Generate dynamic enquiry links
  const whatsappText = `Hi Pallet & Color, I am interested in this product: ${product.name}. Please share price, availability, customization, and delivery details.`;
  const encodedWhatsapp = encodeURIComponent(whatsappText);
  const whatsappUrl = `https://wa.me/91${settings.whatsappNumber}?text=${encodedWhatsapp}`;

  const emailSubject = `Product Enquiry - ${product.name}`;
  const emailBody = `Hi Pallet & Color,\n\nI am interested in this product: ${product.name}.\n\nPlease share price, availability, customization, and delivery details.\n\nThank you.`;
  const mailtoUrl = `mailto:${settings.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Sold':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Made to order':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Out of stock':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-brand-sand text-brand-dark';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fadeIn">
      
      {/* Back navigation button */}
      <div>
        <button
          onClick={() => setView('gallery')}
          className="inline-flex items-center space-x-2 text-sm font-bold text-brand-terracotta hover:text-brand-dark transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Art Gallery</span>
        </button>
      </div>

      {/* Main Grid: Images vs Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Side: Images */}
        <div className="space-y-4">
          {/* Main Visual Frame */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-brand-sand border border-brand-sand shadow-sm">
            <img
              src={product.images[activeImageIndex]?.url || product.mainImage?.url}
              alt={`${product.name} - view ${activeImageIndex + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            
            {/* Status Floating Badge */}
            <span className={`absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${getAvailabilityBadge(product.availabilityStatus)}`}>
              {product.availabilityStatus}
            </span>
          </div>

          {/* Carousel Thumbnail Dots */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-brand-terracotta shadow-md scale-102' : 'border-transparent hover:border-brand-dustypink'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} thumb ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Copy & Enquiries */}
        <div className="space-y-8">
          
          {/* Header Info */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-brand-sage font-extrabold">
              Collection: {product.categoryName || categoryObj?.name || product.categoryId}
            </span>
            <h1 className="font-serif text-3xl md:text-4.5xl font-extrabold tracking-tight text-brand-dark leading-tight">
              {product.name}
            </h1>

            {/* Price Frame */}
            <div className="inline-flex items-center px-4 py-2 bg-brand-sand rounded-full border border-brand-sand/50">
              <span className="text-sm font-bold text-brand-dark/50 mr-1.5 uppercase tracking-wider">Estimated Price:</span>
              <span className="font-serif text-xl font-black text-brand-terracotta">
                {product.priceOnEnquiry ? 'Price on Enquiry' : `₹${product.price}`}
              </span>
            </div>
          </div>

          {/* Specs List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-brand-sand/60 font-sans text-sm">
            <div className="space-y-1">
              <p className="text-xs text-brand-dark/40 font-bold uppercase tracking-widest">Dimensions / Size</p>
              <p className="font-semibold text-brand-dark">{product.dimensions || 'Custom Sizes Available'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-brand-dark/40 font-bold uppercase tracking-widest">Materials Used</p>
              <p className="font-semibold text-brand-dark">{product.material}</p>
            </div>
            <div className="space-y-1 mt-1 sm:mt-0">
              <p className="text-xs text-brand-dark/40 font-bold uppercase tracking-widest">Customizable</p>
              <span className={`inline-flex items-center text-xs font-bold ${product.customizable ? 'text-brand-sage' : 'text-brand-dark/50'}`}>
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                {product.customizable ? 'Yes, customizable layout/colors' : 'Original standard dimensions'}
              </span>
            </div>
            {product.colorOptions && (
              <div className="space-y-1 mt-1 sm:mt-0">
                <p className="text-xs text-brand-dark/40 font-bold uppercase tracking-widest">Featured Colors</p>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="bg-brand-cream border border-brand-sand text-[10px] px-2.5 py-0.5 rounded-full text-brand-dark/80 font-bold">
                    {product.colorOptions}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Descriptions */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-brand-dark">About This Artwork</h3>
            <p className="font-sans text-sm text-brand-dark/70 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* Core Action buttons: EMAIL or WHATSAPP */}
          <div className="space-y-3.5 pt-2">
            <h4 className="text-xs uppercase tracking-wider text-brand-dark/50 font-bold">Contact Studio to Enquire & Order:</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp Option */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2.5 px-6 py-4 bg-[#25d366] hover:bg-[#20ba56] text-white font-sans font-bold text-sm tracking-wider uppercase rounded-2xl shadow-md hover:shadow-lg transition-all text-center"
              >
                <Phone className="w-4.5 h-4.5 fill-current" />
                <span>Enquire via WhatsApp</span>
              </a>

              {/* Email Option */}
              <a
                href={mailtoUrl}
                className="flex items-center justify-center space-x-2.5 px-6 py-4 bg-brand-terracotta hover:bg-brand-terracotta/95 text-white font-sans font-bold text-sm tracking-wider uppercase rounded-2xl shadow-md hover:shadow-lg transition-all text-center"
              >
                <Mail className="w-4.5 h-4.5" />
                <span>Enquire via Email</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Care Instructions & Quality Accents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-brand-sand/60">
        
        {/* Care instructions card */}
        <div className="bg-white p-6 rounded-3xl border border-brand-sand shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-brand-terracotta">
            <FileText className="w-5 h-5" />
            <h3 className="font-serif text-base font-bold">Artwork Care Instructions</h3>
          </div>
          <p className="font-sans text-xs md:text-sm text-brand-dark/70 leading-relaxed font-medium">
            {product.careInstructions || 'Avoid extreme moisture, direct intense heat, and wipe down with a soft, dust-absorbent microfiber cloth to retain its gloss and protective varnish.'}
          </p>
        </div>

        {/* Custom request helper */}
        <div className="bg-brand-sand/30 p-6 rounded-3xl border border-brand-sand/50 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-brand-sage">
              <Compass className="w-5 h-5" />
              <h3 className="font-serif text-base font-bold">Personalized Commissions</h3>
            </div>
            <p className="font-sans text-xs md:text-sm text-brand-dark/70 leading-relaxed font-medium">
              We happily customize size parameters, color pigments, and layout details for our creations. Want this styled in silver instead of gold leaf? Let's talk about it!
            </p>
          </div>
          <button
            onClick={() => setView('contact')}
            className="self-start text-xs font-bold text-brand-terracotta hover:text-brand-dark border-b border-brand-terracotta hover:border-brand-dark transition-all pb-0.5 cursor-pointer"
          >
            Submit Custom Specification Sheet →
          </button>
        </div>

      </div>

    </div>
  );
}
