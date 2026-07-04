/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CloudinaryImage {
  url: string;
  publicId: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  price: number | null;
  priceOnEnquiry: boolean;
  shortDescription: string;
  description: string;
  images: CloudinaryImage[];
  mainImage: CloudinaryImage;
  material: string;
  dimensions: string;
  colorOptions: string;
  careInstructions: string;
  availabilityStatus: 'Available' | 'Sold' | 'Made to order' | 'Out of stock';
  featured: boolean;
  customizable: boolean;
  tags: string[];
  active: boolean;
  createdAt: string; // ISO String (or timestamp formatted to string)
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: CloudinaryImage;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productId: string | null;
  productName: string | null;
  message: string;
  preferredContactMethod: 'WhatsApp' | 'Email' | 'Phone';
  status: 'New' | 'Contacted' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface BusinessSettings {
  businessName: string;
  email: string;
  whatsappNumber: string;
  instagramLink: string;
  facebookLink: string;
  aboutText: string;
  heroTagline: string;
  deliveryNote: string;
  customOrderNote: string;
  updatedAt: string;
}

export type ViewType = 'home' | 'gallery' | 'categories' | 'about' | 'contact' | 'admin' | 'product-details';
