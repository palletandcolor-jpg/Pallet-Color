/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CloudinaryImage } from '../types';

const CLOUDINARY_CLOUD_NAME = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME || 'vbhhfaaz';
const CLOUDINARY_UPLOAD_PRESET = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET || 'pallet_and_color_unsigned';

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates file type and file size.
 * Allowed: jpeg, jpg, png, webp.
 * Max size: 2MB (2,097,152 bytes)
 */
export function validateImageFile(file: File): ImageValidationResult {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type: ${file.name}. Only JPG, JPEG, PNG, and WEBP formats are allowed.`
    };
  }

  const maxBytes = 2 * 1024 * 1024; // 2MB
  if (file.size > maxBytes) {
    return {
      isValid: false,
      error: `File too large: ${file.name}. Maximum allowed size is 2MB (current: ${(file.size / (1024 * 1024)).toFixed(2)}MB).`
    };
  }

  return { isValid: true };
}

/**
 * Generates local object URL for preview purposes.
 */
export function getImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Uploads a single file to Cloudinary using Unsigned upload preset.
 * Passes target folder name (e.g. 'pallet-and-color/products').
 */
export async function uploadImageToCloudinary(
  file: File, 
  folderName: string
): Promise<CloudinaryImage> {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folderName);

  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Cloudinary upload failure response:', errText);
    throw new Error('Failed to upload image to Cloudinary. Please check configuration.');
  }

  const resJson = await response.json();
  
  return {
    url: resJson.secure_url,
    publicId: resJson.public_id
  };
}

/**
 * Uploads multiple images sequentially.
 */
export async function uploadMultipleImagesToCloudinary(
  files: File[], 
  folderName: string
): Promise<CloudinaryImage[]> {
  const results: CloudinaryImage[] = [];
  for (const file of files) {
    const res = await uploadImageToCloudinary(file, folderName);
    results.push(res);
  }
  return results;
}
