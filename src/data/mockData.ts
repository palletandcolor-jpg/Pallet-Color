/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, Product, Enquiry, BusinessSettings } from '../types';

export const initialCategories: Category[] = [
  {
    id: 'resin-art',
    name: 'Resin Art',
    slug: 'resin-art',
    description: 'Bespoke glossy creations ranging from ocean-wave wall clocks and luxury serving trays to floral-preserved coasters.',
    image: {
      url: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=800',
      publicId: 'mock/resin-art'
    },
    active: true,
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z'
  },
  {
    id: 'paintings',
    name: 'Paintings & Canvas',
    slug: 'paintings-and-canvas',
    description: 'Original textured acrylics, vibrant watercolors, and dreamy pastel abstract paintings crafted on premium cotton canvas.',
    image: {
      url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
      publicId: 'mock/paintings'
    },
    active: true,
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z'
  },
  {
    id: 'home-decor',
    name: 'Home Decor & Accents',
    slug: 'home-decor-and-accents',
    description: 'Hand-painted terracotta pots, ceramic art pieces, and custom-styled cozy accents to bring soul into your living spaces.',
    image: {
      url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800',
      publicId: 'mock/home-decor'
    },
    active: true,
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z'
  },
  {
    id: 'customized-gifts',
    name: 'Customized & Keepsakes',
    slug: 'customized-and-keepsakes',
    description: 'Tailor-made memory plaques, botanical-pressed leather journals, resin-poured initials, and custom art requests made just for your loved ones.',
    image: {
      url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
      publicId: 'mock/custom-gifts'
    },
    active: true,
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z'
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-ocean-clock',
    name: 'Ocean Wave Resin Clock',
    slug: 'ocean-wave-resin-clock',
    categoryId: 'resin-art',
    categoryName: 'Resin Art',
    price: 3800,
    priceOnEnquiry: false,
    shortDescription: 'Stunning multi-layered ocean fluid art wall clock with authentic sand and real-gold dust accents.',
    description: 'Bring the soothing rhythm of the ocean to your walls. This multi-layered ocean wave clock is crafted using premium, UV-resistant epoxy resin poured over high-grade birch wood. Real beach sand, shells, and delicate golden powder are embedded within three transparent layers to produce a genuine depth of 3D sea waves. Each piece is entirely unique, mimicking the ebb and flow of real tidepools.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
        publicId: 'mock/ocean-clock-1'
      },
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
        publicId: 'mock/ocean-clock-2'
      }
    ],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
      publicId: 'mock/ocean-clock-1'
    },
    material: 'Premium Epoxy Resin, Birch Wood base, Brass Clock Hands',
    dimensions: '14 inches (Diameter)',
    colorOptions: 'Deep Teal, Azure Blue, Golden Sand, White Foam',
    careInstructions: 'Avoid direct prolonged sunlight exposure. Wipe with a soft, slightly damp microfiber cloth. Do not use chemical abrasive cleaners.',
    availabilityStatus: 'Available',
    featured: true,
    customizable: true,
    tags: ['resin', 'clock', 'ocean', 'blue', 'luxury'],
    active: true,
    createdAt: '2026-06-20T10:00:00Z',
    updatedAt: '2026-06-20T10:00:00Z'
  },
  {
    id: 'prod-pastel-canvas',
    name: 'Ethereal Whispers Abstract Painting',
    slug: 'ethereal-whispers-abstract-painting',
    categoryId: 'paintings',
    categoryName: 'Paintings & Canvas',
    price: null,
    priceOnEnquiry: true,
    shortDescription: 'Heavy-textured acrylic painting on stretched canvas featuring soft pastels, terracotta strokes, and real 24k gold leaf gilding.',
    description: 'An original, signature heavy-textured acrylic artwork exploring internal tranquility. Features abstract layers of dusty blush, clay terracotta, and sage green, punctuated by meticulously applied gold leafing that catches the sunlight beautifully at different angles. This painting adds a premium artistic focus to any modern minimalist living room or bedroom. Arrives ready to hang with painted edges.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
        publicId: 'mock/pastel-canvas-1'
      },
      {
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
        publicId: 'mock/pastel-canvas-2'
      }
    ],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
      publicId: 'mock/pastel-canvas-1'
    },
    material: 'Heavy-body Acrylic Paints, Gold Leaf, Professional Grade Stretched Cotton Canvas',
    dimensions: '24 x 36 inches',
    colorOptions: 'Terracotta, Dusty Rose, Sage, Cream, Gold Leaf',
    careInstructions: 'Dust gently with a clean, dry feather duster or dry cloth. Do not expose to moisture or heavy humidity.',
    availabilityStatus: 'Made to order',
    featured: true,
    customizable: true,
    tags: ['canvas', 'abstract', 'acrylic', 'pastel', 'gold'],
    active: true,
    createdAt: '2026-06-25T11:30:00Z',
    updatedAt: '2026-06-25T11:30:00Z'
  },
  {
    id: 'prod-sage-terracotta-pots',
    name: 'Hand-Painted Mediterranean Clay Pots',
    slug: 'hand-painted-mediterranean-clay-pots',
    categoryId: 'home-decor',
    categoryName: 'Home Decor & Accents',
    price: 1250,
    priceOnEnquiry: false,
    shortDescription: 'Whimsical set of 3 hand-painted terracotta planters featuring organic botanical designs and waterproof internal sealing.',
    description: 'Add a warm, hand-crafted touch to your indoor plant collection. These earthy terracotta pots are hand-sculpted and meticulously painted with delicate sage and beige botanical silhouettes. Features three distinct complementary patterns that look lovely styled together. The interiors are completely sealed with professional waterproof sealant to protect the artwork from potting soil moisture.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800',
        publicId: 'mock/pots-1'
      },
      {
        url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800',
        publicId: 'mock/pots-2'
      }
    ],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800',
      publicId: 'mock/pots-1'
    },
    material: 'Clay Terracotta, Acrylic Paints, Waterproof Interior Shield, Protective Matte Exterior Finish',
    dimensions: 'Small: 4"x4", Medium: 5"x5", Large: 6.5"x6.5"',
    colorOptions: 'Terracotta, Sage Green, Warm Beige, White',
    careInstructions: 'Wipe exterior with a dry cloth. Features a bottom drainage hole for direct planting. Ideal for dry succulents or potted houseplants.',
    availabilityStatus: 'Available',
    featured: true,
    customizable: true,
    tags: ['pottery', 'plant', 'home', 'decor', 'terracotta'],
    active: true,
    createdAt: '2026-06-28T09:15:00Z',
    updatedAt: '2026-06-28T09:15:00Z'
  },
  {
    id: 'prod-pressed-flower-journal',
    name: 'Botanical Pressed-Flower Journal',
    slug: 'botanical-pressed-flower-journal',
    categoryId: 'customized-gifts',
    categoryName: 'Customized & Keepsakes',
    price: 1850,
    priceOnEnquiry: false,
    shortDescription: 'Refillable luxury leather journal with actual real-preserved lavender and fern leaves sealed in glossy crystal-clear cover panels.',
    description: 'Keep your thoughts in a beautiful floral sanctuary. This customized vegan-leather journal incorporates real, hand-pressed garden botanicals (lavender stalks, baby’s breath, and silver fern) sealed in a crystal-clear UV-safe cover resin plate. It comes with premium thick deckle-edge papers inside (ideal for journaling, sketching, or light watercolor painting) and is completely refillable, meaning the artistic cover stays with you forever.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
        publicId: 'mock/journal-1'
      },
      {
        url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=800',
        publicId: 'mock/journal-2'
      }
    ],
    mainImage: {
      url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
      publicId: 'mock/journal-1'
    },
    material: 'Preserved botanicals, UV Resin plate, Refillable Vegan Leather Binder, 120GSM deckle-edge paper',
    dimensions: 'A5 Size (5.8 x 8.3 inches)',
    colorOptions: 'Lavender Purple, Moss Green, Cognac Tan',
    careInstructions: 'Keep away from excessive damp areas. Wipe leather with specialized leather cream if needed; wipe the resin flower panel with soft glass cloth.',
    availabilityStatus: 'Available',
    featured: false,
    customizable: true,
    tags: ['journal', 'flowers', 'gift', 'handmade', 'vintage'],
    active: true,
    createdAt: '2026-07-01T15:45:00Z',
    updatedAt: '2026-07-01T15:45:00Z'
  }
];

export const initialEnquiries: Enquiry[] = [
  {
    id: 'enq-1',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@gmail.com',
    customerPhone: '9876543210',
    productId: 'prod-ocean-clock',
    productName: 'Ocean Wave Resin Clock',
    message: 'Hi, I absolutely love the Ocean Wave Clock! Is it possible to customize the diameter to 18 inches instead of 14? Please let me know the price difference and estimated shipping time to Mumbai.',
    preferredContactMethod: 'WhatsApp',
    status: 'New',
    createdAt: '2026-07-02T10:30:00Z',
    updatedAt: '2026-07-02T10:30:00Z'
  },
  {
    id: 'enq-2',
    customerName: 'Priya Iyer',
    customerEmail: 'priya.iyer@yahoo.com',
    customerPhone: '9001234567',
    productId: 'prod-pastel-canvas',
    productName: 'Ethereal Whispers Abstract Painting',
    message: 'Hello, I wanted to enquire about the price of the Ethereal Whispers abstract painting. Also, do you provide framed canvas options, or does it only come as a stretched canvas?',
    preferredContactMethod: 'Email',
    status: 'Contacted',
    createdAt: '2026-07-03T14:15:00Z',
    updatedAt: '2026-07-03T14:15:00Z'
  }
];

export const defaultSettings: BusinessSettings = {
  businessName: 'Pallet & Color',
  email: 'palletandcolor@gmail.com',
  whatsappNumber: '9635043020',
  instagramLink: 'https://instagram.com/palletandcolor',
  facebookLink: 'https://facebook.com/palletandcolor',
  aboutText: 'Welcome to Pallet & Color! Founded with a vision to translate fleeting moments of nature and tranquility into everlasting handcrafted items, we create premium paintings, functional resin artworks, textured clay accessories, and personalized keepsakes. Every piece is molded, colored, and polished individually in our small home studio, carrying high positive energy and exceptional craftsmanship directly to your living spaces.',
  heroTagline: 'Handcrafted Art, Made with Love',
  deliveryNote: 'We ship safely all across India with customized shock-proof packing to ensure art reaches your home in flawless condition.',
  customOrderNote: 'Have an idea in mind? We customize resin items, canvas size, color palettes, and personalize gifts with special dates or initials. Get in touch!',
  updatedAt: '2026-07-04T00:00:00Z'
};
