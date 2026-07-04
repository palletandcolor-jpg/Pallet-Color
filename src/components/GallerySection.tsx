/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Phone, Sparkles, RotateCcw, AlertCircle } from 'lucide-react';
import { Product, Category, BusinessSettings } from '../types';

interface GallerySectionProps {
  products: Product[];
  categories: Category[];
  settings: BusinessSettings;
  categoryFilter: string;
  setCategoryFilter: (categoryName: string) => void;
  setSelectedProduct: (product: Product) => void;
  setView: (view: 'product-details') => void;
}

export default function GallerySection({
  products,
  categories,
  settings,
  categoryFilter,
  setCategoryFilter,
  setSelectedProduct,
  setView
}: GallerySectionProps) {
  
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<string>('all'); // 'all', 'under-1500', '1500-3000', 'over-3000', 'enquiry-only'
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all'); // 'all', 'Available', 'Made to order', 'Sold', 'Out of stock'
  const [sortBy, setSortBy] = useState<string>('latest'); // 'latest', 'low-high', 'high-low', 'featured'

  const activeCategories = useMemo(() => categories.filter(c => c.active), [categories]);

  // Combined filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category Filter
      if (categoryFilter !== 'all' && product.categoryId !== categoryFilter) {
        return false;
      }

      // 2. Search Query (name or tags)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDescription = product.description.toLowerCase().includes(query);
        const matchesTags = product.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDescription && !matchesTags) {
          return false;
        }
      }

      // 3. Price Filter
      if (priceRange !== 'all') {
        if (priceRange === 'enquiry-only') {
          if (!product.priceOnEnquiry) return false;
        } else {
          if (product.priceOnEnquiry || product.price === null) return false;
          if (priceRange === 'under-1500' && product.price >= 1500) return false;
          if (priceRange === '1500-3000' && (product.price < 1500 || product.price > 3000)) return false;
          if (priceRange === 'over-3000' && product.price <= 3000) return false;
        }
      }

      // 4. Availability Filter
      if (availabilityFilter !== 'all' && product.availabilityStatus !== availabilityFilter) {
        return false;
      }

      return true;
    });
  }, [products, categoryFilter, searchQuery, priceRange, availabilityFilter]);

  // Sorting logic
  const sortedAndFilteredProducts = useMemo(() => {
    const items = [...filteredProducts];
    if (sortBy === 'latest') {
      return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    if (sortBy === 'low-high') {
      return items.sort((a, b) => {
        const priceA = a.priceOnEnquiry || a.price === null ? 999999 : a.price;
        const priceB = b.priceOnEnquiry || b.price === null ? 999999 : b.price;
        return priceA - priceB;
      });
    }
    if (sortBy === 'high-low') {
      return items.sort((a, b) => {
        const priceA = a.priceOnEnquiry || a.price === null ? -1 : a.price;
        const priceB = b.priceOnEnquiry || b.price === null ? -1 : b.price;
        return priceB - priceA;
      });
    }
    if (sortBy === 'featured') {
      return items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return items;
  }, [filteredProducts, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setPriceRange('all');
    setAvailabilityFilter('all');
    setSortBy('latest');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setView('product-details');
  };

  // Availability badge colors helper
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-brand-terracotta font-extrabold">Studio Showcase</span>
        <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-brand-dark">
          Art Catalogue & Showcase
        </h1>
        <p className="max-w-xl mx-auto font-sans text-sm text-brand-dark/70 leading-relaxed font-medium">
          Browse through our original works of art, clocks, keepsakes, and customized home accents. Select any piece to view sizing, materials, and submit an enquiry.
        </p>
        <div className="w-16 h-1 bg-brand-terracotta mx-auto rounded-full" />
      </div>

      {/* Control Panel: Search & Filters Header */}
      <div className="bg-white rounded-3xl p-6 border border-brand-sand shadow-sm space-y-6">
        
        {/* Search & Sort Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brand-dark/40" />
            <input
              type="text"
              id="search-input"
              placeholder="Search art pieces, tags, or materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-brand-cream hover:bg-brand-sand/40 focus:bg-white rounded-xl text-sm font-sans font-medium text-brand-dark border border-brand-sand outline-none focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-all"
            />
          </div>

          {/* Availability Filter dropdown */}
          <div className="relative">
            <select
              id="availability-select"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full px-4 py-3 bg-brand-cream hover:bg-brand-sand/40 focus:bg-white rounded-xl text-sm font-sans font-semibold text-brand-dark border border-brand-sand outline-none focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-all appearance-none cursor-pointer"
            >
              <option value="all">🔍 All Availability Statuses</option>
              <option value="Available">🟢 Available Now</option>
              <option value="Made to order">🔵 Made to Order</option>
              <option value="Sold">🔴 Sold Out / Archive</option>
              <option value="Out of stock">⚪ Out of Stock</option>
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-brand-cream hover:bg-brand-sand/40 focus:bg-white rounded-xl text-sm font-sans font-semibold text-brand-dark border border-brand-sand outline-none focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-all appearance-none cursor-pointer"
            >
              <option value="latest">📅 Sort: Latest Creations</option>
              <option value="featured">✨ Sort: Featured First</option>
              <option value="low-high">🏷️ Price: Low to High</option>
              <option value="high-low">🏷️ Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider text-brand-dark/50 font-bold">Filter by Collection Category:</span>
          <div className="flex flex-wrap gap-2">
            <button
              id="cat-chip-all"
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 rounded-full font-sans text-xs font-bold transition-all cursor-pointer border ${
                categoryFilter === 'all'
                  ? 'bg-brand-terracotta text-white border-brand-terracotta shadow-sm'
                  : 'bg-brand-cream hover:bg-brand-sand text-brand-dark/80 border-brand-sand/80'
              }`}
            >
              All Artworks ({products.length})
            </button>
            {activeCategories.map((cat) => {
              const count = products.filter(p => p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  id={`cat-chip-${cat.id}`}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-4 py-2 rounded-full font-sans text-xs font-bold transition-all cursor-pointer border ${
                    categoryFilter === cat.id
                      ? 'bg-brand-terracotta text-white border-brand-terracotta shadow-sm'
                      : 'bg-brand-cream hover:bg-brand-sand text-brand-dark/80 border-brand-sand/80'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Presets & Reset Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-brand-sand/40 gap-4">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs uppercase tracking-wider text-brand-dark/50 font-bold shrink-0">Budget:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Any Price' },
                { id: 'under-1500', label: 'Under ₹1500' },
                { id: '1500-3000', label: '₹1500 - ₹3000' },
                { id: 'over-3000', label: 'Over ₹3000' },
                { id: 'enquiry-only', label: 'Price on Enquiry' }
              ].map((preset) => (
                <button
                  key={preset.id}
                  id={`price-preset-${preset.id}`}
                  onClick={() => setPriceRange(preset.id)}
                  className={`px-3 py-1.5 rounded-lg font-sans text-xs font-bold transition-all cursor-pointer ${
                    priceRange === preset.id
                      ? 'bg-brand-sage text-white shadow-sm'
                      : 'bg-brand-cream hover:bg-brand-sand text-brand-dark/70'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <button
            id="reset-filters-btn"
            onClick={handleResetFilters}
            className="flex items-center space-x-1.5 text-xs font-bold text-brand-terracotta hover:text-brand-dark border-b border-transparent hover:border-brand-dark transition-all py-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>

      </div>

      {/* Dynamic Results Banner */}
      <div className="flex items-center justify-between text-xs font-bold text-brand-dark/50 px-2 font-mono">
        <span>SHOWING {sortedAndFilteredProducts.length} OF {products.length} CREATIONS</span>
        {categoryFilter !== 'all' && (
          <span>Collection: {categories.find(c => c.id === categoryFilter)?.name}</span>
        )}
      </div>

      {/* Grid of Product Cards */}
      {sortedAndFilteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedAndFilteredProducts.map((product) => (
            <div
              key={product.id}
              id={`product-card-${product.id}`}
              className="bg-white rounded-3xl overflow-hidden border border-brand-sand shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
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
                
                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getAvailabilityBadge(product.availabilityStatus)}`}>
                    {product.availabilityStatus}
                  </span>
                  {product.featured && (
                    <span className="bg-brand-terracotta text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full self-start">
                      ★ Featured
                    </span>
                  )}
                </div>

                {/* Pricing Overlay */}
                <div className="absolute bottom-4 right-4 bg-brand-cream/90 text-brand-dark px-3 py-1 rounded-full font-mono text-xs font-bold border border-brand-sand">
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

                {/* Card footer CTA actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleProductClick(product)}
                    className="py-2.5 text-xs font-bold text-brand-dark hover:text-brand-terracotta bg-brand-cream border border-brand-sand hover:bg-brand-sand rounded-xl transition-all cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <a
                    href={`https://wa.me/91${settings.whatsappNumber}?text=Hi%20Pallet%20%26%20Color%2C%20I%20am%20interested%20in%20this%20product%3A%20${encodeURIComponent(product.name)}.%20Please%20share%20price%2C%20availability%2C%20customization%2C%20and%20delivery%20details.`}
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
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 border border-brand-sand text-center space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 bg-brand-terracotta/10 rounded-full flex items-center justify-center text-brand-terracotta mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-brand-dark">No Artworks Found</h3>
          <p className="font-sans text-xs text-brand-dark/60 leading-relaxed">
            We couldn't find any creations in our catalog that match your specific search criteria. Try removing filters or search keywords to explore more pieces!
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-brand-terracotta hover:bg-brand-terracotta/90 text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Reset Catalog Filters
          </button>
        </div>
      )}

    </div>
  );
}
