/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { Product, Category, Enquiry, BusinessSettings } from '../types';

// Provided Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUF7Qi508SE3x9UDFBNI8OVHSlSV5R6T0",
  authDomain: "palletandcolor-4abd3.firebaseapp.com",
  projectId: "palletandcolor-4abd3",
  storageBucket: "palletandcolor-4abd3.firebasestorage.app",
  messagingSenderId: "283053169863",
  appId: "1:283053169863:web:ba68f2b96e10c1ac15b2e2",
  measurementId: "G-LGL37Z4RJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper to convert Firestore timestamp or other types to ISO string
function convertTimestamp(val: any): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) {
    return val.toDate().toISOString();
  }
  if (typeof val === 'object' && val.seconds !== undefined) {
    return new Date(val.seconds * 1000).toISOString();
  }
  if (typeof val === 'string') {
    return val;
  }
  return new Date().toISOString();
}

/* ==========================================================================
   Admin Authentication Flow Services
   ========================================================================== */

export async function loginAdmin(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function registerAdmin(email: string, password: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function listenToAuthState(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/* ==========================================================================
   Products Collection Services
   ========================================================================== */

export async function addProduct(productData: Omit<Product, 'createdAt' | 'updatedAt'>): Promise<void> {
  const pRef = doc(db, 'products', productData.id);
  await setDoc(pRef, {
    ...productData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function updateProduct(productId: string, productData: Partial<Product>): Promise<void> {
  const pRef = doc(db, 'products', productId);
  const cleanData = { ...productData };
  delete cleanData.createdAt; // preserve original createdAt
  await updateDoc(pRef, {
    ...cleanData,
    updatedAt: serverTimestamp()
  });
}

export async function deleteProduct(productId: string): Promise<void> {
  const pRef = doc(db, 'products', productId);
  await deleteDoc(pRef);
}

export async function getProducts(): Promise<Product[]> {
  const colRef = collection(db, 'products');
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt)
    } as Product;
  });
}

export async function getActiveProducts(): Promise<Product[]> {
  const colRef = collection(db, 'products');
  const q = query(colRef, where('active', '==', true), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt)
    } as Product;
  });
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const colRef = collection(db, 'products');
  const q = query(colRef, where('active', '==', true), where('featured', '==', true), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt)
    } as Product;
  });
}

export async function getProductById(productId: string): Promise<Product | null> {
  const docRef = doc(db, 'products', productId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    ...data,
    id: docSnap.id,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt)
  } as Product;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const colRef = collection(db, 'products');
  const q = query(colRef, where('slug', '==', slug), where('active', '==', true));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data();
  return {
    ...data,
    id: d.id,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt)
  } as Product;
}

/* ==========================================================================
   Categories Collection Services
   ========================================================================== */

export async function addCategory(categoryData: Omit<Category, 'createdAt' | 'updatedAt'>): Promise<void> {
  const cRef = doc(db, 'categories', categoryData.id);
  await setDoc(cRef, {
    ...categoryData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function updateCategory(categoryId: string, categoryData: Partial<Category>): Promise<void> {
  const cRef = doc(db, 'categories', categoryId);
  const cleanData = { ...categoryData };
  delete cleanData.createdAt; // preserve original createdAt
  await updateDoc(cRef, {
    ...cleanData,
    updatedAt: serverTimestamp()
  });
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const cRef = doc(db, 'categories', categoryId);
  await deleteDoc(cRef);
}

export async function getCategories(): Promise<Category[]> {
  const colRef = collection(db, 'categories');
  const q = query(colRef, orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt)
    } as Category;
  });
}

export async function getActiveCategories(): Promise<Category[]> {
  const colRef = collection(db, 'categories');
  const q = query(colRef, where('active', '==', true), orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt)
    } as Category;
  });
}

export async function getCategoryById(categoryId: string): Promise<Category | null> {
  const docRef = doc(db, 'categories', categoryId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    ...data,
    id: docSnap.id,
    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt)
  } as Category;
}

/* ==========================================================================
   Enquiries Collection Services
   ========================================================================== */

export async function addEnquiry(enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const colRef = collection(db, 'enquiries');
  const docRef = await addDoc(colRef, {
    ...enquiryData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  // Update document to save the generated id internally
  await updateDoc(docRef, { id: docRef.id });
  return docRef.id;
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const colRef = collection(db, 'enquiries');
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt)
    } as Enquiry;
  });
}

export async function updateEnquiryStatus(enquiryId: string, status: 'New' | 'Contacted' | 'Completed'): Promise<void> {
  const eRef = doc(db, 'enquiries', enquiryId);
  await updateDoc(eRef, {
    status,
    updatedAt: serverTimestamp()
  });
}

export async function deleteEnquiry(enquiryId: string): Promise<void> {
  const eRef = doc(db, 'enquiries', enquiryId);
  await deleteDoc(eRef);
}

/* ==========================================================================
   Settings Collection Services
   ========================================================================== */

export async function getSettings(): Promise<BusinessSettings> {
  const docRef = doc(db, 'settings', 'main');
  const docSnap = await getDoc(docRef);
  
  const defaultSettings: BusinessSettings = {
    businessName: "Pallet & Color",
    email: "palletandcolor@gmail.com",
    whatsappNumber: "9635043020",
    instagramLink: "https://instagram.com",
    facebookLink: "https://facebook.com",
    aboutText: "Welcome to Pallet & Color. We are a hand-craft studio dedicated to molding custom epoxy resin decor, heavy textured paintings, and floral botanical keepsakes.",
    heroTagline: "Handcrafted Art, Made with Love",
    deliveryNote: "Secure door-step packaging & express transit across India. Custom fragile products handled under professional care.",
    customOrderNote: "We design custom memory preservation keepsakes, resin wall clocks, personalized nameplates, and bespoke wedding favor collections.",
    updatedAt: new Date().toISOString()
  };

  if (!docSnap.exists()) {
    // Write defaults to Firestore if missing so it is created
    await setDoc(docRef, {
      ...defaultSettings,
      updatedAt: serverTimestamp()
    });
    return defaultSettings;
  }

  const data = docSnap.data();
  return {
    ...defaultSettings,
    ...data,
    updatedAt: convertTimestamp(data.updatedAt)
  } as BusinessSettings;
}

export async function updateSettings(settingsData: Partial<BusinessSettings>): Promise<void> {
  const docRef = doc(db, 'settings', 'main');
  await setDoc(docRef, {
    ...settingsData,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

/* ==========================================================================
   Interactive Seeding Helper (Database initialization)
   ========================================================================== */

export async function seedFirestoreIfEmpty(
  categories: Category[], 
  products: Product[]
): Promise<boolean> {
  // Check if categories collection already has entries
  const catSnap = await getDocs(collection(db, 'categories'));
  if (!catSnap.empty) {
    return false; // already initialized
  }

  const batch = writeBatch(db);

  // Add categories
  categories.forEach(cat => {
    const docRef = doc(db, 'categories', cat.id);
    batch.set(docRef, {
      ...cat,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });

  // Add products
  products.forEach(p => {
    const docRef = doc(db, 'products', p.id);
    batch.set(docRef, {
      ...p,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });

  await batch.commit();
  return true;
}
