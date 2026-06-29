/**
 * Cloudinary Image Upload Service
 * 
 * Setup Cloudinary:
 * 1. Buat akun di https://cloudinary.com/
 * 2. Di Dashboard, buat Upload Preset:
 *    - Settings > Upload > Upload presets
 *    - Add upload preset
 *    - Signing Mode: Unsigned
 *    - Copy preset name ke .env
 * 3. Copy Cloud Name, API Key, API Secret ke .env
 */

// Note: Untuk production, sebaiknya gunakan signed upload dari backend
// Unsigned upload hanya untuk development/testing

// Cloudinary config - Using Expo's built-in environment variables prefixed with EXPO_PUBLIC_
const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'de8wyupno';
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'Geo App';

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

interface UploadOptions {
  folder?: string;
  transformation?: string;
  tags?: string[];
}

/**
 * Upload image ke Cloudinary
 * @param imageUri - URI gambar dari device (dari ImagePicker)
 * @param options - Options untuk upload (folder, transformations, dll)
 * @returns Promise dengan URL gambar yang sudah diupload
 */
export const uploadImageToCloudinary = async (
  imageUri: string,
  options: UploadOptions = {}
): Promise<string> => {
  try {
    // Validate config
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error(
        'Cloudinary not configured. Please set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in .env file'
      );
    }

    // Prepare form data
    const formData = new FormData();
    
    // Extract filename from URI
    const filename = imageUri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // Append image file
    formData.append('file', {
      uri: imageUri,
      type: type,
      name: filename,
    } as any);

    // Append upload preset
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // Append optional folder
    if (options.folder) {
      formData.append('folder', options.folder);
    }

    // Append optional tags
    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','));
    }

    // Append transformation (e.g., 'w_500,h_500,c_fill')
    if (options.transformation) {
      formData.append('transformation', options.transformation);
    }

    // Upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data: CloudinaryResponse = await response.json();
    
    // Return secure URL
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete image dari Cloudinary
 * Note: Untuk unsigned upload, delete harus dilakukan dari backend
 * Atau set auto-delete di Cloudinary Dashboard
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  // This requires signed request with API key/secret
  // Should be implemented in backend for security
  console.warn('Delete operation should be implemented in backend for security');
  throw new Error('Delete operation not available for client-side unsigned uploads');
};

/**
 * Get optimized image URL with transformations
 * @param imageUrl - Original Cloudinary URL
 * @param width - Target width
 * @param height - Target height
 * @param quality - Image quality (1-100)
 * @returns Transformed image URL
 */
export const getOptimizedImageUrl = (
  imageUrl: string,
  width?: number,
  height?: number,
  quality: number = 80
): string => {
  if (!imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }

  const transformations: string[] = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push('f_auto'); // Auto format (WebP, etc)
  
  const transformation = transformations.join(',');
  
  // Insert transformation into URL
  return imageUrl.replace('/upload/', `/upload/${transformation}/`);
};

/**
 * Get thumbnail URL
 */
export const getThumbnailUrl = (imageUrl: string): string => {
  return getOptimizedImageUrl(imageUrl, 200, 200, 70);
};

/**
 * Example usage:
 * 
 * // Upload image untuk materi
 * const imageUrl = await uploadImageToCloudinary(imageUri, {
 *   folder: 'geo-contextual-app/materi',
 *   tags: ['materi', 'litosfer'],
 *   transformation: 'w_800,h_600,c_fill'
 * });
 * 
 * // Upload image untuk jurnal
 * const jurnalImageUrl = await uploadImageToCloudinary(imageUri, {
 *   folder: `geo-contextual-app/jurnal/${userId}`,
 *   tags: ['jurnal', userId]
 * });
 * 
 * // Get optimized URL
 * const optimizedUrl = getOptimizedImageUrl(imageUrl, 400, 300, 80);
 * 
 * // Get thumbnail
 * const thumbUrl = getThumbnailUrl(imageUrl);
 */
