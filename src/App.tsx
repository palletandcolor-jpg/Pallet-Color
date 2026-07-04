/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewType, Product, Category, Enquiry, BusinessSettings } from './types';
import { initialCategories, initialProducts, initialEnquiries, defaultSettings } from './data/mockData';
import { 
  listenToAuthState, 
  getSettings, 
  getCategories, 
  getProducts, 
  getEnquiries, 
  seedFirestoreIfEmpty,
  addProduct as fsAddProduct,
  updateProduct as fsUpdateProduct,
  deleteProduct as fsDeleteProduct,
  addCategory as fsAddCategory,
  updateCategory as fsUpdateCategory,
  addEnquiry as fsAddEnquiry,
  updateEnquiryStatus as fsUpdateEnquiryStatus,
  updateSettings as fsUpdateSettings,
  logoutAdmin
} from './lib/firebase';

// Subcomponents
import Header from './components/Header';
import Footer from './components/Footer';
import HomeSection from './components/HomeSection';
import GallerySection from './components/GallerySection';
import ProductDetailsSection from './components/ProductDetailsSection';
import CategoriesSection from './components/CategoriesSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import AdminSection from './components/AdminSection';

export default function App() {
  
  // 1. Core state definitions
  const [currentView, setView] = useState<ViewType>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // 2. Load Firestore Data & setup Auth listener on mount
  useEffect(() => {
    // A. Setup Auth State Listener
    const unsubscribeAuth = listenToAuthState(async (user) => {
      const loggedIn = !!user;
      setIsAdminLoggedIn(loggedIn);
      
      // Fetch enquiries if admin is logged in
      if (loggedIn) {
        try {
          const liveEnqs = await getEnquiries();
          setEnquiries(liveEnqs);
        } catch (err) {
          console.error("Failed to fetch customer enquiries:", err);
        }
      } else {
        setEnquiries([]);
      }
    });

    // B. Fetch initial showcase data
    const loadShowcaseData = async () => {
      try {
        // Fetch Settings
        const liveSettings = await getSettings();
        setSettings(liveSettings);

        // Fetch Categories
        let liveCategories = await getCategories();
        
        // Fetch Products
        let liveProducts = await getProducts();

        // Seed if first time/empty db
        if (liveCategories.length === 0) {
          const seeded = await seedFirestoreIfEmpty(initialCategories, initialProducts);
          if (seeded) {
            liveCategories = await getCategories();
            liveProducts = await getProducts();
          }
        }

        setCategories(liveCategories);
        setProducts(liveProducts);
        
        if (liveProducts.length > 0) {
          setSelectedProduct(liveProducts[0]);
        }
      } catch (err) {
        console.error("Firestore database connection failed. Falling back to mock data:", err);
        // Fallback offline support
        setCategories(initialCategories);
        setProducts(initialProducts);
        setSettings(defaultSettings);
        if (initialProducts.length > 0) {
          setSelectedProduct(initialProducts[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadShowcaseData();

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentView, selectedProduct]);

  // 3. Admin Firestore Mutation Actions
  const handleAddProduct = async (newProduct: Product) => {
    try {
      await fsAddProduct(newProduct);
      const updatedList = await getProducts();
      setProducts(updatedList);
    } catch (err) {
      console.error("Failed to add product to Firestore:", err);
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await fsUpdateProduct(updatedProduct.id, updatedProduct);
      const updatedList = await getProducts();
      setProducts(updatedList);
      if (selectedProduct && selectedProduct.id === updatedProduct.id) {
        setSelectedProduct(updatedProduct);
      }
    } catch (err) {
      console.error("Failed to update product in Firestore:", err);
      setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      if (selectedProduct && selectedProduct.id === updatedProduct.id) {
        setSelectedProduct(updatedProduct);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await fsDeleteProduct(id);
      const updatedList = await getProducts();
      setProducts(updatedList);
    } catch (err) {
      console.error("Failed to delete product from Firestore:", err);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleAddCategory = async (newCategory: Category) => {
    try {
      await fsAddCategory(newCategory);
      const updatedList = await getCategories();
      setCategories(updatedList);
    } catch (err) {
      console.error("Failed to add category to Firestore:", err);
      setCategories((prev) => [...prev, newCategory]);
    }
  };

  const handleUpdateCategory = async (updatedCategory: Category) => {
    try {
      await fsUpdateCategory(updatedCategory.id, updatedCategory);
      const updatedList = await getCategories();
      setCategories(updatedList);
    } catch (err) {
      console.error("Failed to update category in Firestore:", err);
      setCategories((prev) => prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)));
    }
  };

  const handleUpdateEnquiryStatus = async (id: string, status: 'New' | 'Contacted' | 'Completed') => {
    try {
      await fsUpdateEnquiryStatus(id, status);
      const updatedList = await getEnquiries();
      setEnquiries(updatedList);
    } catch (err) {
      console.error("Failed to update enquiry status in Firestore:", err);
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    }
  };

  const handleUpdateSettings = async (updatedSettings: BusinessSettings) => {
    try {
      await fsUpdateSettings(updatedSettings);
      const liveSettings = await getSettings();
      setSettings(liveSettings);
    } catch (err) {
      console.error("Failed to update settings in Firestore:", err);
      setSettings(updatedSettings);
    }
  };

  // 4. Contact Form submit action
  const handleAddEnquiry = async (enqData: Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await fsAddEnquiry(enqData);
      if (isAdminLoggedIn) {
        const updatedList = await getEnquiries();
        setEnquiries(updatedList);
      }
    } catch (err) {
      console.error("Failed to create customer enquiry in Firestore:", err);
      const fallbackEnquiry: Enquiry = {
        ...enqData,
        id: `enq-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setEnquiries((prev) => [fallbackEnquiry, ...prev]);
    }
  };

  // 5. Auth actions
  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setView('admin');
  };

  const handleAdminLogout = async () => {
    try {
      await logoutAdmin();
      setIsAdminLoggedIn(false);
      setView('home');
    } catch (err) {
      console.error("Logout failed:", err);
      setIsAdminLoggedIn(false);
      setView('home');
    }
  };

  // Helper renderer
  const renderActiveSection = () => {
    if (loading) {
      return (
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-terracotta border-t-transparent rounded-full animate-spin"></div>
          <p className="font-serif italic text-brand-dark/60 text-sm">Curation of Pallet & Color Canvas...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return (
          <HomeSection
            setView={setView}
            categories={categories}
            products={products}
            settings={settings}
            setSelectedProduct={setSelectedProduct}
            setCategoryFilter={setCategoryFilter}
          />
        );
      case 'gallery':
        return (
          <GallerySection
            products={products}
            categories={categories}
            settings={settings}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            setSelectedProduct={setSelectedProduct}
            setView={setView as any}
          />
        );
      case 'product-details':
        if (!selectedProduct) {
          return (
            <div className="py-24 text-center space-y-4">
              <p className="text-brand-dark/60">No product selected.</p>
              <button onClick={() => setView('gallery')} className="px-5 py-2 bg-brand-terracotta text-white rounded-xl cursor-pointer">
                Go to Art Gallery
              </button>
            </div>
          );
        }
        return (
          <ProductDetailsSection
            product={selectedProduct}
            categories={categories}
            settings={settings}
            setView={setView as any}
          />
        );
      case 'categories':
        return (
          <CategoriesSection
            categories={categories}
            products={products}
            setCategoryFilter={setCategoryFilter}
            setView={setView}
          />
        );
      case 'about':
        return <AboutSection settings={settings} />;
      case 'contact':
        return (
          <ContactSection
            settings={settings}
            products={products}
            onAddEnquiry={handleAddEnquiry}
          />
        );
      case 'admin':
        return (
          <AdminSection
            products={products}
            categories={categories}
            enquiries={enquiries}
            settings={settings}
            isAdminLoggedIn={isAdminLoggedIn}
            onLogin={handleAdminLogin}
            onLogout={handleAdminLogout}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onUpdateEnquiryStatus={handleUpdateEnquiryStatus}
            onUpdateSettings={handleUpdateSettings}
            setSelectedProduct={setSelectedProduct}
            setView={setView as any}
          />
        );
      default:
        return <div className="py-24 text-center">404 - Section Not Found</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark overflow-x-hidden selection:bg-brand-terracotta/20">
      
      {/* Sticky Header */}
      <Header
        currentView={currentView}
        setView={setView}
        settings={settings}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleAdminLogout}
      />

      {/* Main Content Showcase Canvas */}
      <main className="flex-grow py-6 md:py-10">
        {renderActiveSection()}
      </main>

      {/* Footer */}
      <Footer
        setView={setView}
        settings={settings}
      />

    </div>
  );
}
