/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Sparkles, Award, Coffee, Eye, ShieldCheck } from 'lucide-react';
import { BusinessSettings } from '../types';

interface AboutSectionProps {
  settings: BusinessSettings;
}

export default function AboutSection({ settings }: AboutSectionProps) {
  
  const values = [
    {
      icon: <Heart className="w-6 h-6 fill-current text-brand-terracotta" />,
      title: 'Handmade with Love',
      desc: 'Each creation is crafted carefully in our home studio, embedding sincere passion, unique brush strokes, and positive vibes into every layer.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-brand-gold" />,
      title: 'One-of-a-Kind Pieces',
      desc: 'Because fluid resins and natural terracotta respond differently to manual touch, no two products are identical. Your piece belongs entirely to you.'
    },
    {
      icon: <Award className="w-6 h-6 text-brand-sage" />,
      title: 'Premium Crafting Materials',
      desc: 'We utilize crystal-clear UV-stable epoxy resins, heavy cotton canvases, light-fast rich acrylic pigments, and sturdy brass clock mechanisms.'
    },
    {
      icon: <Coffee className="w-6 h-6 text-brand-terracotta" />,
      title: 'Customized Commissions',
      desc: 'We work closely with you. Choose custom size specifications, select precise dye palettes to match your home paint, or engrave dates and initials.'
    }
  ];

  const processSteps = [
    {
      num: '01',
      title: 'Conceptualization',
      desc: 'We sketch original patterns, discuss color harmonies, and choose the perfect base material (birch wood, canvas, clay, or leather).'
    },
    {
      num: '02',
      title: 'Detailed Assembly',
      desc: 'Acrylics are layered, botanical flowers are carefully dried over weeks, and resin pigments are blended with gold leaf accents.'
    },
    {
      num: '03',
      title: 'Layered Pour & Paint',
      desc: 'Resin is poured over three separate days to achieve authentic 3D wave depth; paints are varnished to prevent UV fading.'
    },
    {
      num: '04',
      title: 'Polishing & Safety Box',
      desc: 'Finished artworks are hand-sanded, edge-polished, and safely locked inside shock-proof nested crates for secured transit.'
    }
  ];

  return (
    <div className="w-full space-y-24 pb-20 animate-fadeIn">
      
      {/* Page Header / Brand Hero */}
      <section className="relative overflow-hidden pt-12 pb-8 text-center max-w-4xl mx-auto px-4 space-y-4">
        <span className="text-xs uppercase tracking-widest text-brand-sage font-extrabold">Behind the Easel</span>
        <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-brand-dark">
          Our Creative Story
        </h1>
        <p className="font-sans text-sm md:text-base text-brand-dark/70 leading-relaxed font-medium">
          Welcome to Pallet & Color! We believe art shouldn't just sit in a museum frame; it should dwell on your living room walls, grace your dinner tables, and inspire your daily journaling.
        </p>
        <div className="w-16 h-1 bg-brand-terracotta mx-auto rounded-full" />
      </section>

      {/* Main Story Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Story copy */}
        <div className="space-y-6">
          <h2 className="font-serif text-3xl font-bold text-brand-dark">
            The Philosophy of Pallet & Color
          </h2>
          <div className="font-sans text-sm md:text-base text-brand-dark/70 space-y-4 leading-relaxed font-medium">
            <p>
              {settings.aboutText}
            </p>
            <p>
              Our specialization in multi-layered resin fluid work stems from a deep obsession with sea waves and natural geodes. By manipulating temperature, air pressure, and high-purity metallic pigments, we simulate the complex depth of ocean coral pools and sparkling volcanic stone inside our custom wall clocks and coaster sets.
            </p>
            <p>
              Similarly, our customized keepsakes—such as dried floral preservation and custom botanical leather journals—allow you to capture key romantic milestones (wedding bouquets, baby showers, memory cards) inside gorgeous, glass-like keepsakes that won't decay with time.
            </p>
          </div>
        </div>

        {/* Studio image grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="h-64 rounded-2xl overflow-hidden shadow-sm border border-brand-sand">
              <img
                src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=500"
                alt="Mixing paint pigments"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-44 rounded-2xl overflow-hidden shadow-sm border border-brand-sand bg-brand-sand/50 p-6 flex flex-col justify-center space-y-2">
              <h4 className="font-serif text-3xl font-bold text-brand-terracotta">100%</h4>
              <p className="font-sans text-xs text-brand-dark/60 font-bold uppercase tracking-wider">Handcrafted in Home Studio</p>
            </div>
          </div>
          <div className="space-y-4 pt-8">
            <div className="h-44 rounded-2xl overflow-hidden shadow-sm border border-brand-sand bg-brand-sage/10 p-6 flex flex-col justify-center space-y-2">
              <h4 className="font-serif text-3xl font-bold text-brand-sage">20+</h4>
              <p className="font-sans text-xs text-brand-dark/60 font-bold uppercase tracking-wider">Days of curing & detailed layers</p>
            </div>
            <div className="h-64 rounded-2xl overflow-hidden shadow-sm border border-brand-sand">
              <img
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=500"
                alt="Finished artwork details"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-brand-sand/30 py-16 border-y border-brand-sand/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-brand-terracotta font-extrabold">Studio Benchmarks</span>
            <h2 className="font-serif text-3xl font-bold text-brand-dark">Our Studio Values</h2>
            <div className="w-12 h-0.5 bg-brand-terracotta mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-brand-sand space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-brand-cream flex items-center justify-center">
                  {v.icon}
                </div>
                <h3 className="font-serif text-base font-bold text-brand-dark">{v.title}</h3>
                <p className="font-sans text-xs text-brand-dark/65 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Process Step Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-brand-sage font-extrabold">How We Create</span>
          <h2 className="font-serif text-3xl font-bold text-brand-dark">The Artistry Process</h2>
          <div className="w-12 h-0.5 bg-brand-sage mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {processSteps.map((step, idx) => (
            <div key={idx} className="space-y-4 relative">
              <div className="text-6xl font-serif font-black text-brand-sand leading-none select-none">
                {step.num}
              </div>
              <h3 className="font-serif text-base font-bold text-brand-dark -mt-4">
                {step.title}
              </h3>
              <p className="font-sans text-xs text-brand-dark/70 leading-relaxed font-medium">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
