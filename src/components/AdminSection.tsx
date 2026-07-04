/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, PlusCircle, LayoutGrid, FolderPlus, Inbox, Settings, 
  Edit, Trash2, Eye, Star, CheckCircle, CheckCircle2, User, Lock, 
  LogOut, Phone, Mail, Search, Image as ImageIcon, Save, Check, Plus, X, Upload, Loader2
} from 'lucide-react';
import { Product, Category, Enquiry, BusinessSettings, CloudinaryImage } from '../types';
import { loginAdmin, registerAdmin } from '../lib/firebase';
import { uploadImageToCloudinary } from '../lib/cloudinary';

interface AdminSectionProps {
  products: Product[];
  categories: Category[];
  enquiries: Enquiry[];
  settings: BusinessSettings;
  isAdminLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  // State changers
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddCategory: (c: Category) => void;
  onUpdateCategory: (c: Category) => void;
  onUpdateEnquiryStatus: (id: string, status: 'New' | 'Contacted' | 'Completed') => void;
  onUpdateSettings: (s: BusinessSettings) => void;
  setSelectedProduct: (product: Product) => void;
  setView: (view: 'product-details') => void;
}

export default function AdminSection({
  products,
  categories,
  enquiries,
  settings,
  isAdminLoggedIn,
  onLogin,
  onLogout,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
  onUpdateCategory,
  onUpdateEnquiryStatus,
  onUpdateSettings,
  setSelectedProduct,
  setView
}: AdminSectionProps) {
  
  // Login states
  const [loginEmail, setLoginEmail] = useState('palletandcolor@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  // Dashboard Sub-navigation Tab
  const [adminTab, setAdminTab] = useState<'overview' | 'add-product' | 'manage-products' | 'categories' | 'enquiries' | 'settings'>('overview');

  // Search inside manage products
  const [manageSearch, setManageSearch] = useState('');
  const [manageCategory, setManageCategory] = useState('all');

  // Product Form states (used for both Add and Edit)
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState('');
  const [pFormName, setPFormName] = useState('');
  const [pFormCategory, setPFormCategory] = useState('');
  const [pFormPrice, setPFormPrice] = useState<number | ''>('');
  const [pFormPriceOnEnquiry, setPFormPriceOnEnquiry] = useState(false);
  const [pFormShortDesc, setPFormShortDesc] = useState('');
  const [pFormDescription, setPFormDescription] = useState('');
  const [pFormMaterial, setPFormMaterial] = useState('');
  const [pFormDimensions, setPFormDimensions] = useState('');
  const [pFormColors, setPFormColors] = useState('');
  const [pFormCare, setPFormCare] = useState('');
  const [pFormAvailability, setPFormAvailability] = useState<'Available' | 'Sold' | 'Made to order' | 'Out of stock'>('Available');
  const [pFormFeatured, setPFormFeatured] = useState(false);
  const [pFormCustomizable, setPFormCustomizable] = useState(true);
  const [pFormTags, setPFormTags] = useState('');
  
  // Custom Cloudinary Image list for Product form
  const [pFormImagesList, setPFormImagesList] = useState<CloudinaryImage[]>([]);
  const [pFormImageInputUrl, setPFormImageInputUrl] = useState('');
  const [pFormImageInputPublicId, setPFormImageInputPublicId] = useState('');
  const [isProductImageUploading, setIsProductImageUploading] = useState(false);
  const [productUploadError, setProductUploadError] = useState('');
  const [pFormSuccessMsg, setPFormSuccessMsg] = useState('');

  // Category Form states
  const [cFormName, setCFormName] = useState('');
  const [cFormDescription, setCFormDescription] = useState('');
  const [cFormImage, setCFormImage] = useState<CloudinaryImage | null>(null);
  const [isCategoryUploading, setIsCategoryUploading] = useState(false);
  const [categoryUploadError, setCategoryUploadError] = useState('');
  const [cFormActive, setCFormActive] = useState(true);
  const [cFormSuccessMsg, setCFormSuccessMsg] = useState('');

  // Live Settings edit states
  const [sName, setSName] = useState(settings.businessName || 'Pallet & Color');
  const [sEmail, setSEmail] = useState(settings.email || 'palletandcolor@gmail.com');
  const [sPhone, setSPhone] = useState(settings.whatsappNumber || '9635043020');
  const [sInsta, setSInsta] = useState(settings.instagramLink || 'https://instagram.com');
  const [sFb, setSFb] = useState(settings.facebookLink || 'https://facebook.com');
  const [sAbout, setSAbout] = useState(settings.aboutText || '');
  const [sTagline, setSTagline] = useState(settings.heroTagline || '');
  const [sDelivery, setSDelivery] = useState(settings.deliveryNote || '');
  const [sCustom, setSCustom] = useState(settings.customOrderNote || '');
  const [sSuccessMsg, setSSuccessMsg] = useState('');

  // Update Settings local state whenever settings props change
  useEffect(() => {
    if (settings) {
      setSName(settings.businessName || 'Pallet & Color');
      setSEmail(settings.email || 'palletandcolor@gmail.com');
      setSPhone(settings.whatsappNumber || '9635043020');
      setSInsta(settings.instagramLink || 'https://instagram.com');
      setSFb(settings.facebookLink || 'https://facebook.com');
      setSAbout(settings.aboutText || '');
      setSTagline(settings.heroTagline || '');
      setSDelivery(settings.deliveryNote || '');
      setSCustom(settings.customOrderNote || '');
    }
  }, [settings]);

  // Real Firebase Auth login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setAuthSuccessMsg('');
    setIsLoggingIn(true);

    try {
      if (isRegistering) {
        await registerAdmin(loginEmail, loginPassword);
        setAuthSuccessMsg('Admin account created successfully! Logging you in...');
        setTimeout(() => {
          onLogin(); // parent state sync
        }, 1500);
      } else {
        await loginAdmin(loginEmail, loginPassword);
        onLogin(); // parent state sync
      }
    } catch (err: any) {
      console.error("Auth attempt failure:", err);
      let errMsg = err.message || 'Error occurred during authentication.';
      if (err.code === 'auth/invalid-credential') {
        errMsg = 'Invalid email or password. If you have not created your admin account yet, toggle to "Create Admin Account" below.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Password is too weak. Must be at least 6 characters.';
      } else if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email is already registered. Please sign in instead.';
      }
      setLoginError(errMsg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Pre-fill Product Form for Editing
  const startEditProduct = (product: Product) => {
    setIsEditingProduct(true);
    setEditingProductId(product.id);
    setPFormName(product.name);
    setPFormCategory(product.categoryId);
    setPFormPrice(product.price !== null ? product.price : '');
    setPFormPriceOnEnquiry(product.priceOnEnquiry);
    setPFormShortDesc(product.shortDescription);
    setPFormDescription(product.description);
    setPFormMaterial(product.material);
    setPFormDimensions(product.dimensions);
    setPFormColors(product.colorOptions);
    setPFormCare(product.careInstructions);
    setPFormAvailability(product.availabilityStatus);
    setPFormFeatured(product.featured);
    setPFormCustomizable(product.customizable);
    setPFormTags(product.tags.join(', '));
    setPFormImagesList(product.images || []);
    setPFormImageInputUrl('');
    setPFormImageInputPublicId('');
    setAdminTab('add-product');
  };

  // Cancel Editing & Reset
  const cancelProductForm = () => {
    setIsEditingProduct(false);
    setEditingProductId('');
    setPFormName('');
    setPFormCategory('');
    setPFormPrice('');
    setPFormPriceOnEnquiry(false);
    setPFormShortDesc('');
    setPFormDescription('');
    setPFormMaterial('');
    setPFormDimensions('');
    setPFormColors('');
    setPFormCare('');
    setPFormAvailability('Available');
    setPFormFeatured(false);
    setPFormCustomizable(true);
    setPFormTags('');
    setPFormImagesList([]);
    setPFormImageInputUrl('');
    setPFormImageInputPublicId('');
    setPFormSuccessMsg('');
    setProductUploadError('');
    setAdminTab('manage-products');
  };

  // Cloudinary image upload handler for Product Images
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (pFormImagesList.length >= 5) {
      setProductUploadError('Maximum limit of 5 images reached for this artwork.');
      return;
    }

    setProductUploadError('');
    setIsProductImageUploading(true);

    try {
      const result = await uploadImageToCloudinary(file, 'pallet-and-color/products');
      setPFormImagesList(prev => [...prev, result]);
    } catch (err: any) {
      console.error(err);
      setProductUploadError(err.message || 'Image upload failed. Check file type and size.');
    } finally {
      setIsProductImageUploading(false);
      // Reset input element
      e.target.value = '';
    }
  };

  // URL fall back fallback support for product image
  const addUrlImageToProductList = () => {
    if (!pFormImageInputUrl.trim()) return;
    if (pFormImagesList.length >= 5) {
      setProductUploadError('Maximum limit of 5 images reached.');
      return;
    }

    const newImg: CloudinaryImage = {
      url: pFormImageInputUrl.trim(),
      publicId: pFormImageInputPublicId.trim() || `manual-${Date.now()}`
    };

    setPFormImagesList(prev => [...prev, newImg]);
    setPFormImageInputUrl('');
    setPFormImageInputPublicId('');
    setProductUploadError('');
  };

  const removeImageFromFormList = (index: number) => {
    const updated = [...pFormImagesList];
    updated.splice(index, 1);
    setPFormImagesList(updated);
    setProductUploadError('');
  };

  // Save Product Submit
  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pFormName.trim()) return;
    const resolvedCategory = pFormCategory || (categories[0]?.id || 'resin-art');
    const categoryObj = categories.find(c => c.id === resolvedCategory);
    const resolvedCategoryName = categoryObj ? categoryObj.name : 'Resin Art';

    const finalImagesList: CloudinaryImage[] = pFormImagesList.length > 0 
      ? pFormImagesList 
      : [{
          url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
          publicId: 'default-art'
        }];

    const mainImage = finalImagesList[0];
    const tagsArr = pFormTags ? pFormTags.split(',').map(t => t.trim()).filter(Boolean) : [];

    const productPayload: Product = {
      id: isEditingProduct ? editingProductId : `prod-${Date.now()}`,
      name: pFormName.trim(),
      slug: pFormName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-'),
      categoryId: resolvedCategory,
      categoryName: resolvedCategoryName,
      price: pFormPriceOnEnquiry ? null : Number(pFormPrice || 0),
      priceOnEnquiry: pFormPriceOnEnquiry,
      shortDescription: pFormShortDesc.trim(),
      description: pFormDescription.trim(),
      images: finalImagesList,
      mainImage: mainImage,
      material: pFormMaterial.trim() || 'Premium Art Supplies',
      dimensions: pFormDimensions.trim() || 'Standard dimensions',
      colorOptions: pFormColors.trim() || 'Custom Palette',
      careInstructions: pFormCare.trim() || 'Dust gently with dry cloth.',
      availabilityStatus: pFormAvailability,
      featured: pFormFeatured,
      customizable: pFormCustomizable,
      tags: tagsArr,
      active: true,
      createdAt: isEditingProduct ? products.find(p => p.id === editingProductId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isEditingProduct) {
      onUpdateProduct(productPayload);
      setPFormSuccessMsg('Product specifications updated successfully!');
    } else {
      onAddProduct(productPayload);
      setPFormSuccessMsg('New product published to active showcase!');
    }

    // Success timeout and reset
    setTimeout(() => {
      setPFormSuccessMsg('');
      cancelProductForm();
    }, 1500);
  };

  // Cloudinary image upload handler for Categories
  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCategoryUploadError('');
    setIsCategoryUploading(true);

    try {
      const result = await uploadImageToCloudinary(file, 'pallet-and-color/categories');
      setCFormImage(result);
    } catch (err: any) {
      console.error(err);
      setCategoryUploadError(err.message || 'Image upload failed. Only JPG, PNG, WEBP files up to 2MB allowed.');
    } finally {
      setIsCategoryUploading(false);
      e.target.value = '';
    }
  };

  // Save Category Submit
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cFormName.trim()) return;

    const catId = cFormName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const imageToUse: CloudinaryImage = cFormImage || {
      url: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=800',
      publicId: 'default-category'
    };

    const categoryPayload: Category = {
      id: catId,
      name: cFormName.trim(),
      slug: catId,
      description: cFormDescription.trim(),
      image: imageToUse,
      active: cFormActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddCategory(categoryPayload);
    setCFormSuccessMsg('New medium category registered successfully!');
    setCFormName('');
    setCFormDescription('');
    setCFormImage(null);
    setCFormActive(true);
    setCategoryUploadError('');

    setTimeout(() => {
      setCFormSuccessMsg('');
    }, 3000);
  };

  // Save Settings Submit
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedSettings: BusinessSettings = {
      businessName: sName,
      email: sEmail,
      whatsappNumber: sPhone,
      instagramLink: sInsta,
      facebookLink: sFb,
      aboutText: sAbout,
      heroTagline: sTagline,
      deliveryNote: sDelivery,
      customOrderNote: sCustom,
      updatedAt: new Date().toISOString()
    };

    onUpdateSettings(updatedSettings);
    setSSuccessMsg('Business settings updated live across showcase!');

    setTimeout(() => {
      setSSuccessMsg('');
    }, 3000);
  };

  const handleProductPreview = (p: Product) => {
    setSelectedProduct(p);
    setView('product-details');
  };

  // Filter manage products list
  const filteredManageProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(manageSearch.toLowerCase()) || p.material.toLowerCase().includes(manageSearch.toLowerCase());
    const matchesCategory = manageCategory === 'all' || p.categoryId === manageCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate status counts
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalEnquiries = enquiries.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      
      {/* CASE 1: NOT LOGGED IN - SHOW LOGIN SCREEN */}
      {!isAdminLoggedIn ? (
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-brand-sand shadow-lg p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-dark">
              {isRegistering ? 'Create Admin Account' : 'Admin Console Login'}
            </h2>
            <p className="font-sans text-xs text-brand-dark/60 leading-relaxed">
              {isRegistering 
                ? 'Register your primary administrator account to gain full access to the showcase control center.' 
                : 'Login to manage showcased products, categories, modify business details, and answer customer enquiries.'}
            </p>
          </div>

          {/* Simple Tab Switcher */}
          <div className="flex border-b border-brand-sand font-sans text-xs">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(false);
                setLoginError('');
                setAuthSuccessMsg('');
              }}
              className={`flex-1 pb-2.5 font-bold text-center border-b-2 transition-all cursor-pointer ${
                !isRegistering 
                  ? 'border-brand-terracotta text-brand-terracotta' 
                  : 'border-transparent text-brand-dark/40 hover:text-brand-dark/70'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegistering(true);
                setLoginError('');
                setAuthSuccessMsg('');
              }}
              className={`flex-1 pb-2.5 font-bold text-center border-b-2 transition-all cursor-pointer ${
                isRegistering 
                  ? 'border-brand-terracotta text-brand-terracotta' 
                  : 'border-transparent text-brand-dark/40 hover:text-brand-dark/70'
              }`}
            >
              Create Admin Account
            </button>
          </div>

          {authSuccessMsg && (
            <div className="bg-green-50 text-green-800 p-3.5 rounded-xl text-xs font-bold border border-green-200">
              {authSuccessMsg}
            </div>
          )}

          {loginError && (
            <div className="space-y-3">
              <div className="bg-red-50 text-red-800 p-3.5 rounded-xl text-xs font-bold border border-red-200">
                {loginError}
              </div>
              
              {loginError.toLowerCase().includes('configuration-not-found') && (
                <div className="bg-amber-50 text-amber-900 p-4 rounded-xl text-xs border border-amber-200 space-y-2">
                  <p className="font-bold flex items-center gap-1">
                    <span>💡</span> How to Fix This Error:
                  </p>
                  <p className="leading-relaxed">
                    This error indicates that the <strong>Email/Password Sign-In Provider</strong> is not enabled in your Firebase project (<code>palletandcolor-4abd3</code>).
                  </p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-amber-700">Firebase Console</a></li>
                    <li>Select your project <strong>palletandcolor-4abd3</strong></li>
                    <li>Click <strong>Authentication</strong> in the left sidebar menu</li>
                    <li>Go to the <strong>Sign-in method</strong> tab at the top</li>
                    <li>Click <strong>Add new provider</strong> and choose <strong>Email/Password</strong></li>
                    <li>Toggle the switch to <strong>Enable</strong>, then click <strong>Save</strong></li>
                  </ol>
                  <p className="pt-1 text-[11px] text-amber-800">
                    Once enabled, refresh this page and try logging in again!
                  </p>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4.5 font-sans">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-dark/60" htmlFor="admin-email">Admin Email Address</label>
              <input
                type="email"
                id="admin-email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="palletandcolor@gmail.com"
                className="w-full px-4 py-3 bg-brand-cream rounded-xl text-sm font-medium text-brand-dark border border-brand-sand outline-none focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta"
                required
              />
              {isRegistering && (
                <p className="text-[10px] text-brand-dark/50">
                  Note: For Firestore rules consistency, this registration email should be <code>palletandcolor@gmail.com</code>.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-dark/60" htmlFor="admin-password">Console Password</label>
              <input
                type="password"
                id="admin-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-brand-cream rounded-xl text-sm font-medium text-brand-dark border border-brand-sand outline-none focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta"
                required
              />
            </div>

            <button
              type="submit"
              id="admin-login-btn"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-brand-terracotta hover:bg-brand-terracotta/95 text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer text-center flex items-center justify-center space-x-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isRegistering ? 'Creating Account...' : 'Signing In...'}</span>
                </>
              ) : (
                <span>{isRegistering ? 'Register & Sign In' : 'Sign In To Console'}</span>
              )}
            </button>
          </form>

        </div>
      ) : (
        /* CASE 2: LOGGED IN - SHOW DASHBOARD UI */
        <div className="space-y-8">
          
          {/* Dashboard Header Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-brand-sand p-6 rounded-3xl shadow-sm gap-4">
            <div className="flex items-center space-x-3 text-center sm:text-left">
              <div className="w-11 h-11 rounded-2xl bg-brand-terracotta text-white flex items-center justify-center">
                <User className="w-5.5 h-5.5" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-brand-dark">Pallet & Color Admin</h1>
                <p className="text-xs text-brand-sage font-sans font-bold uppercase tracking-wider">Showcase Control Center</p>
              </div>
            </div>

            {/* Logout button */}
            <button
              id="admin-logout-btn"
              onClick={onLogout}
              className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Console</span>
            </button>
          </div>

          {/* Admin Navigation and Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Controls (3 columns) */}
            <div className="lg:col-span-3 bg-white border border-brand-sand rounded-3xl p-5 shadow-sm space-y-2">
              <h3 className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest px-3 mb-2">Management Panels</h3>
              
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: <BarChart3 className="w-4.5 h-4.5" /> },
                { id: 'manage-products', label: 'Manage Products', icon: <LayoutGrid className="w-4.5 h-4.5" /> },
                { id: 'add-product', label: isEditingProduct ? 'Edit Product Form' : 'Add New Product', icon: <PlusCircle className="w-4.5 h-4.5" /> },
                { id: 'categories', label: 'Manage Categories', icon: <FolderPlus className="w-4.5 h-4.5" /> },
                { id: 'enquiries', label: `Customer Enquiries (${enquiries.filter(e => e.status === 'New').length} New)`, icon: <Inbox className="w-4.5 h-4.5" /> },
                { id: 'settings', label: 'Business Settings', icon: <Settings className="w-4.5 h-4.5" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`admin-tab-${tab.id}`}
                  onClick={() => {
                    setAdminTab(tab.id as any);
                    if (tab.id !== 'add-product' && isEditingProduct) {
                      setIsEditingProduct(false);
                      setEditingProductId('');
                    }
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 text-left rounded-xl font-sans text-xs font-bold transition-all cursor-pointer ${
                    adminTab === tab.id 
                      ? 'bg-brand-terracotta text-white shadow-sm' 
                      : 'text-brand-dark/80 hover:bg-brand-sand hover:text-brand-terracotta'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Portal (9 columns) */}
            <div className="lg:col-span-9 bg-white border border-brand-sand rounded-3xl p-6 md:p-8 shadow-sm">
              
              {/* TAB 1: OVERVIEW */}
              {adminTab === 'overview' && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="border-b border-brand-sand/60 pb-4">
                    <h2 className="font-serif text-2xl font-bold text-brand-dark">Console Dashboard Overview</h2>
                    <p className="font-sans text-xs text-brand-dark/50">High-level live catalog counts and user interest trackers fetched from Cloud Firestore database.</p>
                  </div>

                  {/* Stats Tiles */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-brand-cream p-5 rounded-2xl border border-brand-sand text-center space-y-1 shadow-sm">
                      <p className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest">Total Art Products</p>
                      <h4 className="font-serif text-3xl font-extrabold text-brand-terracotta">{totalProducts}</h4>
                      <p className="text-[10px] font-sans text-brand-dark/50">Active on site</p>
                    </div>
                    <div className="bg-brand-cream p-5 rounded-2xl border border-brand-sand text-center space-y-1 shadow-sm">
                      <p className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest">Active Mediums</p>
                      <h4 className="font-serif text-3xl font-extrabold text-brand-sage">{totalCategories}</h4>
                      <p className="text-[10px] font-sans text-brand-dark/50">Distinct categories</p>
                    </div>
                    <div className="bg-brand-cream p-5 rounded-2xl border border-brand-sand text-center space-y-1 shadow-sm">
                      <p className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest">New Enquiries</p>
                      <h4 className="font-serif text-3xl font-extrabold text-orange-600">{enquiries.filter(e => e.status === 'New').length}</h4>
                      <p className="text-[10px] font-sans text-brand-dark/50">Awaiting contact</p>
                    </div>
                    <div className="bg-brand-cream p-5 rounded-2xl border border-brand-sand text-center space-y-1 shadow-sm">
                      <p className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest">Processed Logs</p>
                      <h4 className="font-serif text-3xl font-extrabold text-brand-dark/70">{enquiries.filter(e => e.status !== 'New').length}</h4>
                      <p className="text-[10px] font-sans text-brand-dark/50">Completed & followups</p>
                    </div>
                  </div>

                  {/* Quick Shortcut guides */}
                  <div className="bg-brand-cream/40 p-6 rounded-2xl border border-brand-sand space-y-3">
                    <h3 className="font-serif text-sm font-bold text-brand-dark">⚡ Live Catalog Checklist & Actionable Shortcuts</h3>
                    <ul className="space-y-2.5 font-sans text-xs text-brand-dark/80">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-brand-sage shrink-0" />
                        <span><strong>Cloudinary Hosting:</strong> Fully automated unsign uploads optimized up to 2MB.</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-brand-sage shrink-0" />
                        <span><strong>Showcase Ready:</strong> Set prices as <code className="bg-brand-cream px-1 py-0.5 rounded border">Price on Enquiry</code> to receive customized project size briefs.</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-brand-sage shrink-0" />
                        <span><strong>Contact Syncing:</strong> Customers can initiate direct chat replies from inside the enquiries tab below.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: ADD / EDIT PRODUCT */}
              {adminTab === 'add-product' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-brand-sand/60 pb-4">
                    <h2 className="font-serif text-2xl font-bold text-brand-dark">
                      {isEditingProduct ? 'Modify Showcase Artwork Specifications' : 'Publish New Artwork / Custom Product'}
                    </h2>
                    <p className="font-sans text-xs text-brand-dark/50">
                      Fill out specifications, materials, and upload high-resolution images. Published items are instantly discoverable.
                    </p>
                  </div>

                  {pFormSuccessMsg && (
                    <div className="bg-green-50 text-green-800 p-3.5 rounded-xl text-xs font-bold border border-green-200">
                      {pFormSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleProductFormSubmit} className="space-y-5 font-sans">
                    {/* Row 1: Name & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60" htmlFor="pform-name">Product Name *</label>
                        <input
                          type="text"
                          id="pform-name"
                          value={pFormName}
                          onChange={(e) => setPFormName(e.target.value)}
                          placeholder="e.g. Ocean Resin Wall Clock 16''"
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-sm"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60" htmlFor="pform-category">Showcase Category Collection *</label>
                        <select
                          id="pform-category"
                          value={pFormCategory}
                          onChange={(e) => setPFormCategory(e.target.value)}
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-sm"
                          required
                        >
                          <option value="">-- Select Category --</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Price & Enquiry Flag */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-brand-sand/10 p-4 rounded-xl border border-brand-sand">
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-brand-dark/60" htmlFor="pform-price">Estimated Selling Price (INR)</label>
                        <input
                          type="number"
                          id="pform-price"
                          value={pFormPrice}
                          onChange={(e) => setPFormPrice(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 3500"
                          disabled={pFormPriceOnEnquiry}
                          className="w-full px-4 py-2 bg-brand-cream border border-brand-sand rounded-xl text-sm disabled:opacity-40"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2 py-2">
                        <input
                          type="checkbox"
                          id="pform-enquiry"
                          checked={pFormPriceOnEnquiry}
                          onChange={(e) => setPFormPriceOnEnquiry(e.target.checked)}
                          className="w-4.5 h-4.5 border-brand-sand text-brand-terracotta rounded cursor-pointer"
                        />
                        <label className="text-xs font-bold text-brand-dark/70 cursor-pointer" htmlFor="pform-enquiry">
                          Price on Enquiry
                        </label>
                      </div>
                    </div>

                    {/* Descriptions */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60" htmlFor="pform-shortdesc">Short Summary (Featured in grids) *</label>
                        <input
                          type="text"
                          id="pform-shortdesc"
                          value={pFormShortDesc}
                          onChange={(e) => setPFormShortDesc(e.target.value)}
                          placeholder="e.g. Delicate ocean-wave epoxy finish over sustainable birch with real pearls."
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-sm"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60" htmlFor="pform-longdesc">Detailed Description (Featured on details card)</label>
                        <textarea
                          id="pform-longdesc"
                          value={pFormDescription}
                          onChange={(e) => setPFormDescription(e.target.value)}
                          placeholder="Provide the story of the work, layers involved, inspiration, and creation details..."
                          rows={3}
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    {/* Dimensions & Materials */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60" htmlFor="pform-dimensions">Dimensions / Physical Size</label>
                        <input
                          type="text"
                          id="pform-dimensions"
                          value={pFormDimensions}
                          onChange={(e) => setPFormDimensions(e.target.value)}
                          placeholder="e.g. 14 inches diameter, or 24 x 36 inches"
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60" htmlFor="pform-material">Base Materials Used</label>
                        <input
                          type="text"
                          id="pform-material"
                          value={pFormMaterial}
                          onChange={(e) => setPFormMaterial(e.target.value)}
                          placeholder="e.g. UV-Stable Resin, Brass mechanisms, Terracotta"
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    {/* Colors & Tags & Care */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60" htmlFor="pform-colors">Color Palette (Comma separated / single text)</label>
                        <input
                          type="text"
                          id="pform-colors"
                          value={pFormColors}
                          onChange={(e) => setPFormColors(e.target.value)}
                          placeholder="Azure Blue, Metallic Gold, Pearlescent White"
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60" htmlFor="pform-tags">Search Tags (Comma separated)</label>
                        <input
                          type="text"
                          id="pform-tags"
                          value={pFormTags}
                          onChange={(e) => setPFormTags(e.target.value)}
                          placeholder="clock, ocean, resin, terracotta"
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60" htmlFor="pform-availability">Availability Status *</label>
                        <select
                          id="pform-availability"
                          value={pFormAvailability}
                          onChange={(e) => setPFormAvailability(e.target.value as any)}
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-sm cursor-pointer"
                        >
                          <option value="Available">🟢 Available Now</option>
                          <option value="Made to order">🔵 Made to Order</option>
                          <option value="Sold">🔴 Sold Out / Archive</option>
                          <option value="Out of stock">⚪ Out of stock</option>
                        </select>
                      </div>
                    </div>

                    {/* Toggles: Featured & Customizable */}
                    <div className="grid grid-cols-2 gap-4 bg-brand-cream p-4 rounded-xl border border-brand-sand">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="pform-featured"
                          checked={pFormFeatured}
                          onChange={(e) => setPFormFeatured(e.target.checked)}
                          className="w-4.5 h-4.5 border-brand-sand text-brand-terracotta rounded cursor-pointer"
                        />
                        <label className="text-xs font-bold text-brand-dark/70 cursor-pointer" htmlFor="pform-featured">
                          Highlight as Featured Product
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="pform-custom"
                          checked={pFormCustomizable}
                          onChange={(e) => setPFormCustomizable(e.target.checked)}
                          className="w-4.5 h-4.5 border-brand-sand text-brand-terracotta rounded cursor-pointer"
                        />
                        <label className="text-xs font-bold text-brand-dark/70 cursor-pointer" htmlFor="pform-custom">
                          Custom Orders Available
                        </label>
                      </div>
                    </div>

                    {/* Care Instructions */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-dark/60" htmlFor="pform-care">Specific Care Instructions</label>
                      <input
                        type="text"
                        id="pform-care"
                        value={pFormCare}
                        onChange={(e) => setPFormCare(e.target.value)}
                        placeholder="Avoid prolonged extreme sunlight; wipe down with damp microfiber..."
                        className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-sm"
                      />
                    </div>

                    {/* Image Upload Block (Cloudinary Integration) */}
                    <div className="space-y-4 bg-brand-sand/10 p-5 rounded-2xl border border-brand-sand">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-brand-sand/50 pb-2">
                        <label className="text-xs font-bold text-brand-dark/70 block">
                          Art Image References * <span className="text-brand-dark/50">(Max 5 images. Drag/Select file or use fallback URL)</span>
                        </label>
                        {pFormImagesList.length > 0 && (
                          <span className="text-[10px] font-bold text-brand-sage uppercase">
                            {pFormImagesList.length} of 5 added
                          </span>
                        )}
                      </div>

                      {productUploadError && (
                        <div className="text-[11px] font-semibold text-red-700 bg-red-50 p-2 border border-red-100 rounded-lg">
                          ⚠️ {productUploadError}
                        </div>
                      )}

                      {/* File Uploader widget */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* File selector input */}
                        <div className="border-2 border-dashed border-brand-sand bg-white/70 hover:bg-white p-5 rounded-xl text-center transition-all flex flex-col items-center justify-center space-y-2 group relative">
                          <input
                            type="file"
                            accept="image/jpeg, image/png, image/webp, image/jpg"
                            onChange={handleProductImageUpload}
                            disabled={isProductImageUploading || pFormImagesList.length >= 5}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          />
                          {isProductImageUploading ? (
                            <>
                              <Loader2 className="w-8 h-8 text-brand-terracotta animate-spin" />
                              <p className="text-[11px] font-bold text-brand-dark/70">Uploading to Cloudinary...</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-brand-dark/40 group-hover:text-brand-terracotta transition-colors" />
                              <p className="text-[11px] font-bold text-brand-dark/80">Click or Drag Image File</p>
                              <p className="text-[9px] text-brand-dark/50">Supports JPEG, PNG, WEBP (Max 2MB)</p>
                            </>
                          )}
                        </div>

                        {/* Fallback URL manual input */}
                        <div className="bg-brand-cream border border-brand-sand/80 p-4 rounded-xl flex flex-col justify-center space-y-3.5">
                          <p className="text-[10px] font-bold text-brand-dark/65 uppercase tracking-wider block">Fallback Image URL Injector:</p>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={pFormImageInputUrl}
                              onChange={(e) => setPFormImageInputUrl(e.target.value)}
                              placeholder="Paste high-res hosting URL..."
                              className="w-full px-3 py-2 bg-white border border-brand-sand rounded-lg text-xs"
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={pFormImageInputPublicId}
                                onChange={(e) => setPFormImageInputPublicId(e.target.value)}
                                placeholder="Optional public_id key"
                                className="w-2/3 px-3 py-2 bg-white border border-brand-sand rounded-lg text-xs font-mono"
                              />
                              <button
                                type="button"
                                onClick={addUrlImageToProductList}
                                disabled={pFormImagesList.length >= 5}
                                className="w-1/3 py-2 bg-brand-sage hover:bg-brand-sage/95 text-white text-[11px] font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer disabled:opacity-45"
                              >
                                Add URL
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Display added product images */}
                      {pFormImagesList.length > 0 && (
                        <div className="pt-3 border-t border-brand-sand/40">
                          <p className="text-[10px] font-bold text-brand-dark/50 uppercase tracking-wider mb-2">Curation Queue:</p>
                          <div className="flex flex-wrap gap-3.5">
                            {pFormImagesList.map((img, idx) => (
                              <div key={idx} className="relative w-20 h-20 rounded-xl border border-brand-sand overflow-hidden group shadow-sm bg-brand-cream shrink-0">
                                <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                {idx === 0 && (
                                  <div className="absolute top-1 left-1 bg-brand-terracotta text-white font-sans font-bold text-[7px] uppercase px-1.5 py-0.5 rounded-full shadow-xs">
                                    Primary
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeImageFromFormList(idx)}
                                  className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                  <Trash2 className="w-4.5 h-4.5" />
                                  <span className="text-[9px] font-bold uppercase mt-0.5">Remove</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Form actions */}
                    <div className="flex gap-4 pt-2">
                      <button
                        type="submit"
                        id="save-product-btn"
                        className="flex-grow sm:flex-none px-8 py-3.5 bg-brand-terracotta hover:bg-brand-terracotta/95 text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isEditingProduct ? 'Save Product Modifications' : 'Publish Product to Catalogue'}</span>
                      </button>
                      {isEditingProduct && (
                        <button
                          type="button"
                          onClick={cancelProductForm}
                          className="px-6 py-3.5 bg-brand-cream border border-brand-sand text-brand-dark/70 font-sans text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-sand"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                  </form>
                </div>
              )}

              {/* TAB 3: MANAGE PRODUCTS TABLE */}
              {adminTab === 'manage-products' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-brand-sand/60 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-brand-dark">Manage Art Products</h2>
                      <p className="font-sans text-xs text-brand-dark/50">Search, edit, preview, or delete artworks from the active Firestore database.</p>
                    </div>
                    <button
                      id="add-product-shortcut-btn"
                      onClick={() => setAdminTab('add-product')}
                      className="px-4 py-2 bg-brand-terracotta text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-terracotta/90 flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Product</span>
                    </button>
                  </div>

                  {/* Search and Category Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="relative sm:col-span-2">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
                      <input
                        type="text"
                        placeholder="Search products by title or materials..."
                        value={manageSearch}
                        onChange={(e) => setManageSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-xs outline-none focus:ring-1 focus:ring-brand-terracotta/20"
                      />
                    </div>
                    <div>
                      <select
                        value={manageCategory}
                        onChange={(e) => setManageCategory(e.target.value)}
                        className="w-full px-3 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-xs cursor-pointer"
                      >
                        <option value="all">🔍 All Categories</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className="overflow-x-auto border border-brand-sand rounded-2xl bg-brand-cream/40">
                    <table className="w-full text-left border-collapse text-xs font-sans">
                      <thead>
                        <tr className="bg-brand-cream border-b border-brand-sand font-bold text-brand-dark/70 text-[10px] uppercase tracking-wider">
                          <th className="p-4">Visual</th>
                          <th className="p-4">Artwork Name</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-sand/60">
                        {filteredManageProducts.length > 0 ? (
                          filteredManageProducts.map((p) => {
                            const mainImgUrl = p.mainImage?.url || p.images?.[0]?.url || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800';
                            return (
                              <tr key={p.id} id={`manage-row-${p.id}`} className="hover:bg-brand-sand/20 transition-colors">
                                <td className="p-4">
                                  <img src={mainImgUrl} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-brand-sand shrink-0 shadow-xs" />
                                </td>
                                <td className="p-4 font-bold text-brand-dark">
                                  <div className="space-y-0.5">
                                    <span>{p.name}</span>
                                    {p.featured && (
                                      <span className="block text-[8px] bg-brand-terracotta/10 text-brand-terracotta px-1.5 py-0.5 rounded-full w-max font-bold uppercase tracking-wider">
                                        ★ Featured
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 text-brand-dark/60 font-semibold">
                                  {categories.find(c => c.id === p.categoryId)?.name || p.categoryName || p.categoryId}
                                </td>
                                <td className="p-4 font-mono font-bold text-brand-dark">
                                  {p.priceOnEnquiry ? 'Enquiry' : `₹${p.price}`}
                                </td>
                                <td className="p-4">
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                    p.availabilityStatus === 'Available' ? 'bg-green-100 text-green-800' :
                                    p.availabilityStatus === 'Made to order' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {p.availabilityStatus}
                                  </span>
                                </td>
                                <td className="p-4 text-right whitespace-nowrap space-x-1">
                                  <button
                                    onClick={() => handleProductPreview(p)}
                                    className="p-1.5 text-brand-dark hover:text-brand-terracotta hover:bg-brand-sand rounded-lg cursor-pointer inline-flex"
                                    title="Preview Product details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => startEditProduct(p)}
                                    className="p-1.5 text-brand-dark hover:text-brand-sage hover:bg-brand-sand rounded-lg cursor-pointer inline-flex"
                                    title="Edit Artwork specifications"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to remove "${p.name}" from the active database?`)) {
                                        onDeleteProduct(p.id);
                                      }
                                    }}
                                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer inline-flex"
                                    title="Delete product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-brand-dark/50">
                              No artworks match search or filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* TAB 4: ADD / MANAGE CATEGORIES */}
              {adminTab === 'categories' && (
                <div className="space-y-8 animate-fadeIn">
                  
                  {/* Part A: Add Category Form */}
                  <div className="space-y-4">
                    <div className="border-b border-brand-sand/60 pb-3">
                      <h2 className="font-serif text-xl font-bold text-brand-dark">Register a Creative Medium / Category Collection</h2>
                      <p className="font-sans text-xs text-brand-dark/50">Add a new medium to filter paintings, resin works, and customized gifts.</p>
                    </div>

                    {cFormSuccessMsg && (
                      <div className="bg-green-50 text-green-800 p-3 rounded-xl text-xs font-bold border border-green-200">
                        {cFormSuccessMsg}
                      </div>
                    )}

                    <form onSubmit={handleCategorySubmit} className="space-y-4 font-sans text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-brand-dark/60 block" htmlFor="cform-name">Category Name *</label>
                          <input
                            type="text"
                            id="cform-name"
                            value={cFormName}
                            onChange={(e) => setCFormName(e.target.value)}
                            placeholder="e.g. Pottery & Clay Accents"
                            className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-xs"
                            required
                          />
                        </div>
                        
                        {/* File selector for Category image */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-brand-dark/60 block">Category Cover Image *</label>
                          <div className="flex items-center space-x-3 bg-brand-sand/10 p-2 rounded-xl border border-brand-sand relative">
                            <input
                              type="file"
                              accept="image/jpeg, image/png, image/webp, image/jpg"
                              onChange={handleCategoryImageUpload}
                              disabled={isCategoryUploading}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="py-1 px-3 bg-white border rounded-lg text-[10px] font-bold text-brand-dark/70 flex items-center space-x-1 shadow-xs">
                              <Upload className="w-3.5 h-3.5 text-brand-terracotta" />
                              <span>{isCategoryUploading ? 'Uploading...' : 'Upload cover'}</span>
                            </div>
                            {cFormImage ? (
                              <span className="text-[10px] font-bold text-brand-sage truncate max-w-[120px]">
                                Ready: {cFormImage.publicId}
                              </span>
                            ) : (
                              <span className="text-[10px] text-brand-dark/40">No file chosen</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {categoryUploadError && (
                        <div className="text-[10px] text-red-700 bg-red-50 p-2 rounded-lg border border-red-100 font-semibold">
                          {categoryUploadError}
                        </div>
                      )}

                      {/* Cover Preview */}
                      {cFormImage && (
                        <div className="relative w-28 h-14 rounded-lg overflow-hidden border border-brand-sand">
                          <img src={cFormImage.url} alt="Cover Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setCFormImage(null)}
                            className="absolute right-1 top-1 bg-black/60 p-1 text-white rounded-full hover:bg-black"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60 block" htmlFor="cform-desc">Collection Brief Description *</label>
                        <input
                          type="text"
                          id="cform-desc"
                          value={cFormDescription}
                          onChange={(e) => setCFormDescription(e.target.value)}
                          placeholder="Short tagline summarizing what makes this collection craft unique..."
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-xs"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="cform-active"
                          checked={cFormActive}
                          onChange={(e) => setCFormActive(e.target.checked)}
                          className="w-4 h-4 border-brand-sand text-brand-terracotta rounded cursor-pointer"
                        />
                        <label className="text-xs font-bold text-brand-dark/70 cursor-pointer" htmlFor="cform-active">
                          Category Status Active (Renders in user filters)
                        </label>
                      </div>

                      <button
                        type="submit"
                        id="save-category-btn"
                        disabled={isCategoryUploading}
                        className="px-6 py-2.5 bg-brand-terracotta hover:bg-brand-terracotta/95 text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
                      >
                        {isCategoryUploading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading Asset...</span>
                          </>
                        ) : (
                          <span>Register New Collection</span>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Part B: Manage Categories List */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg font-bold text-brand-dark border-b border-brand-sand/60 pb-2">Currently Active Collections</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {categories.map((c) => {
                        const count = products.filter(p => p.categoryId === c.id).length;
                        const catImgUrl = c.image?.url || 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=800';
                        return (
                          <div key={c.id} className="p-4 border border-brand-sand rounded-2xl bg-brand-cream/20 flex items-center space-x-3 justify-between">
                            <div className="flex items-center space-x-2 min-w-0">
                              <img src={catImgUrl} alt={c.name} className="w-10 h-10 object-cover rounded-lg border shrink-0 shadow-xs" />
                              <div className="space-y-0.5 min-w-0">
                                <h4 className="font-serif text-sm font-bold text-brand-dark truncate">{c.name}</h4>
                                <p className="text-[10px] text-brand-dark/50 uppercase tracking-wider font-mono">{count} products catalogued</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 shrink-0">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${c.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {c.active ? 'Active' : 'Hidden'}
                              </span>
                              <button
                                onClick={() => onUpdateCategory({ ...c, active: !c.active })}
                                className="text-[10px] font-bold text-brand-terracotta hover:underline cursor-pointer"
                              >
                                Toggle
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 5: CUSTOMER ENQUIRIES */}
              {adminTab === 'enquiries' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-brand-sand/60 pb-4">
                    <h2 className="font-serif text-2xl font-bold text-brand-dark">Logged Customer Enquiries</h2>
                    <p className="font-sans text-xs text-brand-dark/50">Follow up with incoming customer requirements via prefilled emails or direct WhatsApp chats.</p>
                  </div>

                  <div className="space-y-4">
                    {enquiries.length > 0 ? (
                      [...enquiries].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((e) => {
                        const dateStr = new Date(e.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        });

                        // Generate quick prefilled WhatsApp & Email respond strings
                        const respondSubject = `RE: ${e.productName || 'Custom Art Showcase enquiry'} - Pallet & Color`;
                        const respondBody = `Hi ${e.customerName},\n\nThank you for reaching out to Pallet & Color regarding your interest in our "${e.productName || 'Custom Handcrafted Art'}".\n\nI would be delighted to share the price details and customization options. Let me know if you would like to adjust the dimensions or choose a custom color layout!`;
                        const respondMailto = `mailto:${e.customerEmail}?subject=${encodeURIComponent(respondSubject)}&body=${encodeURIComponent(respondBody)}`;

                        const respondWhatsappMsg = `Hi ${e.customerName}, this is Pallet %26 Color! Replying to your enquiry about "${e.productName || 'Custom Handcrafted Art'}" logged on our website. Please share if you have custom specifications.`;
                        const respondWhatsappUrl = `https://wa.me/${e.customerPhone}?text=${respondWhatsappMsg}`;

                        return (
                          <div 
                            key={e.id} 
                            id={`enquiry-card-${e.id}`}
                            className={`p-5 rounded-2xl border transition-all ${
                              e.status === 'New' 
                                ? 'bg-brand-sand/30 border-brand-terracotta/40 shadow-sm' 
                                : 'bg-white border-brand-sand'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-brand-sand/60 pb-3 mb-3 text-xs font-sans">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-brand-dark text-sm">{e.customerName}</span>
                                  <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    e.status === 'New' ? 'bg-brand-terracotta text-white' : e.status === 'Contacted' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                  }`}>
                                    {e.status}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2 text-[10px] text-brand-dark/50 pt-0.5">
                                  <span>Email: {e.customerEmail || 'N/A'}</span>
                                  <span>•</span>
                                  <span>WhatsApp: {e.customerPhone || 'N/A'}</span>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-brand-dark/40 shrink-0">{dateStr}</span>
                            </div>

                            <div className="space-y-2 text-xs font-sans">
                              <div>
                                <span className="text-[9px] font-bold text-brand-dark/45 uppercase tracking-wider block">Interested In:</span>
                                <span className="font-bold text-brand-terracotta text-xs">{e.productName || 'Bespoke Custom Commission / Craft Inquiry'}</span>
                              </div>

                              <div>
                                <span className="text-[9px] font-bold text-brand-dark/45 uppercase tracking-wider block">Customer Message:</span>
                                <p className="text-brand-dark/80 bg-white p-3 rounded-xl border border-brand-sand leading-relaxed italic">
                                  "{e.message}"
                                </p>
                              </div>
                            </div>

                            {/* Actions bar */}
                            <div className="flex flex-wrap gap-2.5 pt-4 mt-1 border-t border-brand-sand/60 text-xs">
                              <select
                                value={e.status}
                                onChange={(eSelect) => onUpdateEnquiryStatus(e.id, eSelect.target.value as any)}
                                className="px-2.5 py-1.5 bg-brand-cream border border-brand-sand rounded-xl text-[10px] font-bold cursor-pointer"
                              >
                                <option value="New">🟢 Status: New</option>
                                <option value="Contacted">🔵 Status: Contacted</option>
                                <option value="Completed">⚪ Status: Completed</option>
                              </select>

                              {e.customerEmail && (
                                <a
                                  href={respondMailto}
                                  className="flex items-center space-x-1 px-3 py-1.5 bg-brand-terracotta hover:bg-brand-terracotta/90 text-white rounded-xl text-[10px] font-bold transition-all"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>Reply via Email</span>
                                </a>
                              )}

                              {e.customerPhone && (
                                <a
                                  href={respondWhatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-1 px-3 py-1.5 bg-[#25d366] hover:bg-[#25d366]/90 text-white rounded-xl text-[10px] font-bold transition-all"
                                >
                                  <Phone className="w-3 h-3 fill-current" />
                                  <span>Open WhatsApp</span>
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center py-10 font-sans text-xs text-brand-dark/50 bg-brand-cream/20 rounded-2xl border">
                        No customer enquiries have been submitted yet.
                      </p>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 6: BUSINESS SETTINGS */}
              {adminTab === 'settings' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-brand-sand/60 pb-4">
                    <h2 className="font-serif text-2xl font-bold text-brand-dark">Global Business Settings</h2>
                    <p className="font-sans text-xs text-brand-dark/50">Edit primary brand settings and contact links. Modifications reflect immediately across the public pages in real time.</p>
                  </div>

                  {sSuccessMsg && (
                    <div className="bg-green-50 text-green-800 p-3.5 rounded-xl text-xs font-bold border border-green-200">
                      {sSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleSettingsSubmit} className="space-y-4 font-sans text-xs">
                    
                    {/* Brand Name & Tagline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60 block" htmlFor="set-name">Business Name</label>
                        <input
                          type="text"
                          id="set-name"
                          value={sName}
                          onChange={(e) => setSName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-xs font-bold"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60 block" htmlFor="set-tagline">Hero Tagline</label>
                        <input
                          type="text"
                          id="set-tagline"
                          value={sTagline}
                          onChange={(e) => setSTagline(e.target.value)}
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-xs"
                          required
                        />
                      </div>
                    </div>

                    {/* Contacts: Email & WhatsApp */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60 block" htmlFor="set-email">Gmail Address</label>
                        <input
                          type="email"
                          id="set-email"
                          value={sEmail}
                          onChange={(e) => setSEmail(e.target.value)}
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-xs font-mono"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60 block" htmlFor="set-phone">WhatsApp Contact (Number only, no + symbol)</label>
                        <input
                          type="text"
                          id="set-phone"
                          value={sPhone}
                          onChange={(e) => setSPhone(e.target.value)}
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-xs font-mono"
                          required
                        />
                      </div>
                    </div>

                    {/* Socials */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60 block" htmlFor="set-insta">Instagram Link</label>
                        <input
                          type="text"
                          id="set-insta"
                          value={sInsta}
                          onChange={(e) => setSInsta(e.target.value)}
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60 block" htmlFor="set-fb">Facebook Link</label>
                        <input
                          type="text"
                          id="set-fb"
                          value={sFb}
                          onChange={(e) => setSFb(e.target.value)}
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    {/* Studio Story Narrative */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-dark/60 block" htmlFor="set-about">About Brand Text (Featured on Homepage/Story)</label>
                      <textarea
                        id="set-about"
                        value={sAbout}
                        onChange={(e) => setSAbout(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-xs leading-relaxed"
                        required
                      />
                    </div>

                    {/* Delivery & Custom Orders Note */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60 block" htmlFor="set-delivery">Safe Delivery Assurance Note</label>
                        <textarea
                          id="set-delivery"
                          value={sDelivery}
                          onChange={(e) => setSDelivery(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-xs"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark/60 block" htmlFor="set-custom">Bespoke Custom Orders Detail</label>
                        <textarea
                          id="set-custom"
                          value={sCustom}
                          onChange={(e) => setSCustom(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2.5 bg-brand-cream border border-brand-sand rounded-xl text-xs"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="save-settings-btn"
                      className="px-8 py-3.5 bg-brand-terracotta hover:bg-brand-terracotta/95 text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center space-x-2 animate-fadeIn"
                    >
                      <Save className="w-4 h-4" />
                      <span>Commit Global Changes</span>
                    </button>

                  </form>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
