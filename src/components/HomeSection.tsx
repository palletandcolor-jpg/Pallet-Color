/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Phone, Sparkles, Heart, Gift, Shield, Check } from 'lucide-react';
import { ViewType, Category, Product, BusinessSettings } from '../types';

interface HomeSectionProps {
  setView: (view: ViewType) => void;
  categories: Category[];
  products: Product[];
  settings: BusinessSettings;
  setSelectedProduct: (product: Product) => void;
  setCategoryFilter: (categoryName: string) => void;
}

export default function HomeSection({
  setView,
  categories,
  products,
  settings,
  setSelectedProduct,
  setCategoryFilter
}: HomeSectionProps) {
  
  // Get active categories
  const activeCategories = categories.filter(c => c.active).slice(0, 4);
  
  // Get featured products
  const featuredProducts = products.filter(p => p.featured).slice(0, 3);

  // Helper to trigger product view
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setView('product-details');
  };

  // Helper to trigger category filter & view
  const handleCategoryClick = (categoryId: string) => {
    setCategoryFilter(categoryId);
    setView('gallery');
  };

  return (
    <div className="w-full space-y-24 pb-20 animate-fadeIn">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-6 md:pt-12 pb-12 md:pb-20 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          
          {/* Left Column */}
          <div className="w-full md:w-1/2 space-y-6 text-left">
            <span className="text-brand-terracotta font-serif italic text-lg md:text-xl block">
              Handcrafted Art, Made with Love
            </span>
            <h1 className="text-5xl md:text-7xl font-serif leading-[0.95] text-brand-dark tracking-tight">
              The Beauty of <br/> 
              <span className="text-brand-sage font-serif italic">Imperfect</span> Craft.
            </h1>
            <p className="text-sm md:text-base text-brand-dark/70 max-w-md leading-relaxed font-light italic">
              Discover a curated collection of premium resin art, bespoke textured paintings, and handmade decor items designed to transform your living space into a personal gallery.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="hero-explore-btn"
                onClick={() => {
                  setCategoryFilter('all');
                  setView('gallery');
                }}
                className="px-6 py-3.5 bg-brand-terracotta text-white text-xs uppercase tracking-widest rounded-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 font-medium cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                id="hero-whatsapp-btn"
                href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Pallet%20and%20Color%2C%20I%20am%20interested%20in%20discussing%20a%20customized%20artwork%20or%20resin%20keepsake%20with%20you.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 border border-brand-terracotta text-brand-terracotta text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 font-medium hover:bg-brand-sand transition-all duration-300 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Enquire via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Beautiful Arch and Circle Sticker */}
          <div className="w-full md:w-1/2 flex justify-center relative pt-8 md:pt-0">
            {/* Elegant Terracotta Background Glow */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-brand-dustypink/15 blur-3xl -z-10" />
            
            {/* Arch */}
            <div className="w-64 h-80 bg-brand-dustypink rounded-t-full border-[10px] border-white shadow-2xl overflow-hidden relative group">
              <img
                src={featuredProducts[0]?.mainImage?.url || (featuredProducts[0]?.images && featuredProducts[0]?.images[0]?.url) || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800"}
                alt={featuredProducts[0]?.name || "Autumn Gold Art"}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-brand-terracotta/10 mix-blend-multiply pointer-events-none"></div>
              <div 
                onClick={() => featuredProducts[0] && handleProductClick(featuredProducts[0])}
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/40 to-transparent p-6 text-center text-white cursor-pointer"
              >
                <div className="text-xl font-serif italic mb-1">
                  {featuredProducts[0]?.name || "Autumn Gold"}
                </div>
                <div className="text-[9px] tracking-widest uppercase opacity-80">
                  Featured Original Creation
                </div>
              </div>
            </div>

            {/* Rotated Sticker badge */}
            <div className="absolute -bottom-4 md:bottom-2 left-6 md:left-12 w-36 h-36 bg-brand-sage rounded-full border-[6px] border-brand-cream flex items-center justify-center text-center p-4 shadow-xl rotate-12 transform hover:rotate-6 transition-transform duration-300 pointer-events-none">
              <p className="text-white font-serif text-xs italic leading-tight">
                100% Organic Materials & Pigments
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-widest text-brand-sage font-extrabold">Shop by Style</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark">
            Our Handcrafted Collections
          </h2>
          <div className="w-12 h-1 bg-brand-terracotta mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeCategories.map((category) => (
            <div
              key={category.id}
              id={`category-card-${category.id}`}
              onClick={() => handleCategoryClick(category.id)}
              className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-brand-sand/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image box */}
              <div className="relative h-48 overflow-hidden bg-brand-sand">
                <img
                  src={category.image?.url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800'}
                  alt={category.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent opacity-60" />
                <span className="absolute bottom-4 left-4 bg-brand-cream/90 text-brand-terracotta text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-brand-sand">
                  Explore
                </span>
              </div>
              {/* Details */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-2">
                <h3 className="font-serif text-lg font-bold text-brand-dark group-hover:text-brand-terracotta transition-colors">
                  {category.name}
                </h3>
                <p className="font-sans text-xs text-brand-dark/60 leading-relaxed line-clamp-2">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Artworks Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-brand-sand/30 py-16 rounded-xl border border-brand-sand/50">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-brand-terracotta font-extrabold">Highly Lovable</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark">
              Featured Gallery Pieces
            </h2>
            <div className="w-12 h-1 bg-brand-terracotta md:ml-0 mx-auto rounded-full" />
          </div>
          <button
            onClick={() => {
              setCategoryFilter('all');
              setView('gallery');
            }}
            className="mt-4 md:mt-0 self-center text-sm font-bold text-brand-terracotta hover:text-brand-dark flex items-center space-x-1 cursor-pointer group"
          >
            <span>View Full Art Gallery</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              id={`featured-product-card-${product.id}`}
              className="bg-white rounded-xl overflow-hidden border border-brand-sand/80 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Product Visual */}
              <div 
                className="relative h-64 overflow-hidden bg-brand-sand cursor-pointer group"
                onClick={() => handleProductClick(product)}
              >
                <img
                  src={product.mainImage?.url || (product.images && product.images[0]?.url) || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800'}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  <span className="bg-brand-terracotta text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    Featured
                  </span>
                  {product.customizable && (
                    <span className="bg-brand-sage text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      Customizable
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 bg-brand-cream/90 text-brand-dark px-3 py-1 rounded-full font-mono text-xs font-bold border border-brand-sand">
                  {product.priceOnEnquiry ? 'Price on enquiry' : `₹${product.price}`}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-sage">
                    {product.categoryName || product.categoryId}
                  </span>
                  <h3 
                    onClick={() => handleProductClick(product)}
                    className="font-serif text-lg font-bold text-brand-dark hover:text-brand-terracotta cursor-pointer transition-colors"
                  >
                    {product.name}
                  </h3>
                  <p className="font-sans text-xs text-brand-dark/70 leading-relaxed line-clamp-2">
                    {product.shortDescription}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleProductClick(product)}
                    className="py-2.5 text-xs font-bold text-brand-dark hover:text-brand-terracotta bg-brand-cream border border-brand-sand hover:bg-brand-sand rounded-xl transition-all cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <a
                    href={`https://wa.me/91${settings.whatsappNumber}?text=Hi%20Pallet%20%26%20Color%2C%20I%20am%20interested%20in%20this%20featured%20art%20product%3A%20${encodeURIComponent(product.name)}.%20Please%20share%20price%2C%20availability%2C%20customization%2C%20and%20delivery%20details.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 text-xs font-bold text-white bg-brand-terracotta hover:bg-brand-terracotta/95 rounded-xl transition-all text-center flex items-center justify-center space-x-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Enquire Now</span>
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 4. Brand Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Image layout */}
        <div className="relative">
          {/* Main big image */}
          <div className="h-96 w-full rounded-3xl overflow-hidden shadow-lg border border-brand-sand">
            <img
              src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800"
              alt="Artisan studio workspace"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Overlaid secondary image */}
          <div className="absolute -bottom-8 -right-6 h-48 w-48 rounded-2xl overflow-hidden shadow-xl border-4 border-brand-cream hidden sm:block">
            <img
              src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=500"
              alt="Making resin art coaster details"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Aesthetic terracotta artistic circle decoration */}
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-brand-terracotta/20 rounded-full blur-xl -z-10" />
        </div>

        {/* Right Side: Copy */}
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest text-brand-sage font-extrabold">Our Creative Philosophy</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark">
            Meet the Heart Behind Pallet & Color
          </h2>
          <p className="font-sans text-sm md:text-base text-brand-dark/70 leading-relaxed font-medium">
            {settings.aboutText}
          </p>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-brand-sage/15 flex items-center justify-center text-brand-sage">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="font-sans text-sm font-bold text-brand-dark/80">Committed to pure, 100% handcrafted details</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-brand-sage/15 flex items-center justify-center text-brand-sage">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="font-sans text-sm font-bold text-brand-dark/80">High UV-safe, scratch-resistant premium resin pour</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-brand-sage/15 flex items-center justify-center text-brand-sage">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="font-sans text-sm font-bold text-brand-dark/80">Highly customized color layouts and personalization options</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setView('about')}
              className="px-6 py-3 bg-brand-dark text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-brand-terracotta transition-colors duration-300 cursor-pointer"
            >
              Read Full Studio Story
            </button>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-brand-sage font-extrabold">Made With Absolute Intent</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-dark">
            Why Pallet & Color Art?
          </h2>
          <div className="w-12 h-1 bg-brand-terracotta mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="bg-white p-6 rounded-3xl border border-brand-sand shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <h3 className="font-serif text-base font-bold text-brand-dark">100% Handcrafted</h3>
            <p className="font-sans text-xs text-brand-dark/60 leading-relaxed">
              Meticulously designed, mixed, poured, and painted by hand. No factory reproduction—every item carries unique soul.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-brand-sand shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-sage/15 text-brand-sage flex items-center justify-center mx-auto">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-brand-dark">Fully Customizable</h3>
            <p className="font-sans text-xs text-brand-dark/60 leading-relaxed">
              Modify sizes, choose specific color palettes to complement your wall paint, or write names/dates into keepsakes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-brand-sand shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-brand-dark">Premium Art Standards</h3>
            <p className="font-sans text-xs text-brand-dark/60 leading-relaxed">
              Using the highest grade UV-stable bubble-free resin, premium stretched cotton canvases, and light-fast paints.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-brand-sand shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-brand-dark">Safe Shockproof Delivery</h3>
            <p className="font-sans text-xs text-brand-dark/60 leading-relaxed">
              We pack canvases & fragile resin claddings with bubble blankets and wooden crate frames so they arrive in pristine shape.
            </p>
          </div>

        </div>
      </section>

      {/* 6. Customer Enquiry CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-brand-dark text-white p-8 md:p-14 overflow-hidden border border-brand-terracotta shadow-xl">
          {/* Subtle backgrounds */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-terracotta/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-brand-sage/15 blur-3xl" />

          <div className="relative z-10 max-w-2xl space-y-6 text-center md:text-left">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-dustypink">
              Custom Order Commissions Open
            </span>
            <h2 className="font-serif text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              Looking for something bespoke? We bring your vision to life.
            </h2>
            <p className="font-sans text-sm text-gray-300 leading-relaxed">
              {settings.customOrderNote} Choose specific resin flow patterns, select abstract canvas sizes to match your wall proportions, or package custom gifts for your events. Let’s collaborate!
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={() => setView('contact')}
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-terracotta hover:bg-brand-terracotta/90 text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md text-center cursor-pointer"
              >
                Request Custom Order
              </button>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Pallet%20and%20Color%2C%20I%20want%20to%20place%20a%20custom%20order%20for%20art.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-transparent border border-white/20 hover:border-white hover:bg-white/5 text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4 text-brand-dustypink" />
                <span>Discuss on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
