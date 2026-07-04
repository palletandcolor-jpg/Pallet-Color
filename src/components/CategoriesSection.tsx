/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category, Product, ViewType } from '../types';

interface CategoriesSectionProps {
  categories: Category[];
  products: Product[];
  setCategoryFilter: (categoryName: string) => void;
  setView: (view: ViewType) => void;
}

export default function CategoriesSection({
  categories,
  products,
  setCategoryFilter,
  setView
}: CategoriesSectionProps) {

  const activeCategories = categories.filter(c => c.active);

  const handleCategorySelect = (categoryId: string) => {
    setCategoryFilter(categoryId);
    setView('gallery');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fadeIn">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-brand-sage font-extrabold">Creative Mediums</span>
        <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-brand-dark">
          Explore Our Collections
        </h1>
        <p className="max-w-xl mx-auto font-sans text-sm text-brand-dark/70 leading-relaxed font-medium">
          Diving deep into resin mediums, high-pigment acrylic paints, natural clay pots, and personalized botanical preserves to adorn your daily life.
        </p>
        <div className="w-16 h-1 bg-brand-terracotta mx-auto rounded-full" />
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {activeCategories.map((cat) => {
          // Calculate actual count from current products state
          const count = products.filter(p => p.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              id={`category-detail-card-${cat.id}`}
              onClick={() => handleCategorySelect(cat.id)}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-brand-sand shadow-sm hover:shadow-lg transition-all duration-300 grid grid-cols-1 sm:grid-cols-12 h-full"
            >
              {/* Category Image - spans 5 columns on desktop */}
              <div className="relative sm:col-span-5 h-64 sm:h-auto overflow-hidden bg-brand-sand">
                <img
                  src={cat.image?.url || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800'}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent sm:hidden" />
              </div>

              {/* Category Info - spans 7 columns on desktop */}
              <div className="sm:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-brand-sage/15 text-brand-sage border border-brand-sage/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      {count} {count === 1 ? 'Creation' : 'Creations'}
                    </span>
                    <Sparkles className="w-4 h-4 text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <h2 className="font-serif text-xl md:text-2xl font-bold text-brand-dark group-hover:text-brand-terracotta transition-colors">
                    {cat.name}
                  </h2>
                  <p className="font-sans text-xs md:text-sm text-brand-dark/65 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-bold text-brand-terracotta group-hover:text-brand-dark transition-colors">
                  <span>Explore Collection Catalog</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
