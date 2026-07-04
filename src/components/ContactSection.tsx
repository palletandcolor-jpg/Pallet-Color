/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, Clock, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { BusinessSettings, Enquiry, Product } from '../types';

interface ContactSectionProps {
  settings: BusinessSettings;
  products: Product[];
  onAddEnquiry: (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function ContactSection({
  settings,
  products,
  onAddEnquiry
}: ContactSectionProps) {
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [productInterested, setProductInterested] = useState('General Custom Order');
  const [message, setMessage] = useState('');
  
  // Feedback states
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSuccess(false);

    // Simple validation
    if (!name.trim()) {
      setErrorMsg('Please provide your name.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMsg('Please provide either an email address or WhatsApp phone number so we can contact you.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please write a short message describing your enquiry.');
      return;
    }

    // Capture product details
    const selectedProduct = products.find(p => p.id === productInterested || p.name === productInterested);

    // Fire callback to save in parent state (local storage/memory)
    onAddEnquiry({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      productId: selectedProduct ? selectedProduct.id : null,
      productName: selectedProduct ? selectedProduct.name : productInterested,
      message: message,
      preferredContactMethod: phone.trim() ? 'WhatsApp' : 'Email',
      status: 'New'
    });

    // Reset Form
    setName('');
    setEmail('');
    setPhone('');
    setProductInterested('General Custom Order');
    setMessage('');
    setIsSuccess(true);

    // Timeout success message
    setTimeout(() => {
      setIsSuccess(false);
    }, 8000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-fadeIn">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-brand-terracotta font-extrabold">Let's Collaborate</span>
        <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-brand-dark">
          Contact & Enquiry Studio
        </h1>
        <p className="max-w-xl mx-auto font-sans text-sm text-brand-dark/70 leading-relaxed font-medium">
          Have an idea for a custom resin table clock, or want to preserve your wedding flowers inside a serving tray? Drop us a line below or reach out on WhatsApp.
        </p>
        <div className="w-16 h-1 bg-brand-terracotta mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Contact Information (5 columns) */}
        <div className="lg:col-span-5 space-y-8 bg-white p-8 rounded-3xl border border-brand-sand shadow-sm">
          
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-brand-dark">Get in Touch</h2>
            <p className="font-sans text-xs text-brand-dark/60 leading-relaxed">
              We respond to WhatsApp chats almost immediately and aim to answer all email contact queries within 12-24 business hours.
            </p>
          </div>

          <div className="space-y-6 font-sans">
            
            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="w-11 h-11 rounded-2xl bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-brand-dark/40 font-bold uppercase tracking-wider">Email Address</p>
                <a href={`mailto:${settings.email}`} className="font-bold text-brand-dark hover:text-brand-terracotta transition-colors break-all">
                  {settings.email}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start space-x-4">
              <div className="w-11 h-11 rounded-2xl bg-[#25d366]/10 text-[#25d366] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 fill-current" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-brand-dark/40 font-bold uppercase tracking-wider">WhatsApp & Phone</p>
                <a 
                  href={`https://wa.me/91${settings.whatsappNumber}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold text-brand-dark hover:text-brand-terracotta transition-colors"
                >
                  +91 {settings.whatsappNumber}
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-start space-x-4">
              <div className="w-11 h-11 rounded-2xl bg-brand-sage/15 text-brand-sage flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-brand-dark/40 font-bold uppercase tracking-wider">Studio Business Hours</p>
                <p className="font-bold text-brand-dark text-sm">
                  10:00 AM – 7:00 PM (Monday – Saturday)
                </p>
                <p className="text-xs text-brand-dark/50">Sunday: Closed (For brainstorming and curating designs)</p>
              </div>
            </div>

            {/* Studio Location */}
            <div className="flex items-start space-x-4">
              <div className="w-11 h-11 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-brand-dark/40 font-bold uppercase tracking-wider">Studio Base Location</p>
                <p className="font-bold text-brand-dark text-sm">
                  Pallet & Color Studio, West Bengal, India
                </p>
                <p className="text-xs text-brand-dark/50">Shipping safely across entire states in India.</p>
              </div>
            </div>

          </div>

          {/* Quick Chat Link */}
          <div className="pt-4 border-t border-brand-sand/60 text-center">
            <a
              href={`https://wa.me/91${settings.whatsappNumber}?text=Hi%20Pallet%20%26%20Color%2C%20I%20am%20writing%20to%20enquire%20about%20your%20custom%20handcrafted%20items.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-xs font-bold text-[#25d366] hover:text-brand-dark transition-all border border-[#25d366] hover:border-brand-dark rounded-full px-5 py-2.5 bg-[#25d366]/5 hover:bg-brand-sand cursor-pointer"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>Initiate Direct WhatsApp Chat</span>
            </a>
          </div>

        </div>

        {/* Right Side: Contact Form (7 columns) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-brand-sand shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-bold text-brand-dark">Send an Inquiry Form</h3>
            <p className="font-sans text-xs text-brand-dark/60 leading-relaxed">
              Fill out your details and product preferences below. Submitting will register your enquiry directly inside the showcase local administration state.
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="bg-red-50 text-red-800 p-4 rounded-xl text-xs font-bold border border-red-200 flex items-center space-x-2">
              <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <div className="bg-green-50 text-green-900 p-4 rounded-xl text-xs font-bold border border-green-200 space-y-1">
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="font-bold">Inquiry Sent Successfully!</span>
              </div>
              <p className="text-green-800/80 pl-7">
                Thank you! Your enquiry has been logged into our local dashboard state. We will inspect it and contact you shortly. Feel free to also send a backup text on WhatsApp for rapid responses!
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-5 font-sans">
            
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-dark/60" htmlFor="contact-name">Your Full Name *</label>
                <input
                  type="text"
                  id="contact-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priyanth Sen"
                  className="w-full px-4 py-3 bg-brand-cream hover:bg-brand-sand/40 focus:bg-white rounded-xl text-sm font-medium text-brand-dark border border-brand-sand outline-none focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-all"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-dark/60" htmlFor="contact-email">Email Address</label>
                <input
                  type="email"
                  id="contact-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priyanth.sen@gmail.com"
                  className="w-full px-4 py-3 bg-brand-cream hover:bg-brand-sand/40 focus:bg-white rounded-xl text-sm font-medium text-brand-dark border border-brand-sand outline-none focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-all"
                />
              </div>
            </div>

            {/* Row 2: Phone & Interest Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-dark/60" htmlFor="contact-phone">WhatsApp Number</label>
                <input
                  type="tel"
                  id="contact-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-3 bg-brand-cream hover:bg-brand-sand/40 focus:bg-white rounded-xl text-sm font-medium text-brand-dark border border-brand-sand outline-none focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-dark/60" htmlFor="contact-interest">Interest / Product of Choice</label>
                <select
                  id="contact-interest"
                  value={productInterested}
                  onChange={(e) => setProductInterested(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-cream hover:bg-brand-sand/40 focus:bg-white rounded-xl text-sm font-medium text-brand-dark border border-brand-sand outline-none focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-all cursor-pointer appearance-none"
                >
                  <option value="General Custom Order">🎁 General Custom Order</option>
                  <option value="Flower Preservation Order">🌸 Flower Resin Preservation</option>
                  <option value="Custom Watercolor / Oil Canvas">🎨 Custom Acrylic Painting</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      🛍️ Catalog: {p.name} ({p.priceOnEnquiry ? 'Price on enquiry' : `₹${p.price}`})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-dark/60" htmlFor="contact-message">Your Detailed Enquiry *</label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mention desired sizes, customized palettes, delivery locations, or specific references here..."
                rows={4}
                className="w-full px-4 py-3 bg-brand-cream hover:bg-brand-sand/40 focus:bg-white rounded-xl text-sm font-medium text-brand-dark border border-brand-sand outline-none focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                id="submit-enquiry-btn"
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-terracotta hover:bg-brand-terracotta/95 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Submit Secure Inquiry</span>
                <Send className="w-4 h-4" />
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
