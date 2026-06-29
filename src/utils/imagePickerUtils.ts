import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
  type: string;
}

/**
 * Request camera permissions
 */
export const requestCameraPermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Izin Diperlukan',
        'Aplikasi memerlukan izin kamera untuk mengambil foto.'
      );
      return false;
    }
  }
  return true;
};

/**
 * Request media library permissions
 */
export const requestMediaLibraryPermissions = async (): Promise<boolean> => {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Izin Diperlukan',
        'Aplikasi memerlukan izin galeri untuk memilih foto.'
      );
      return false;
    }
  }
  return true;
};

/**
 * Pick image from gallery
 */
export const pickImageFromGallery = async (): Promise<ImagePickerResult | null> => {
  try {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) {
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: asset.type || 'image',
      };
    }

    return null;
  } catch (error) {
    console.error('Error picking image from gallery:', error);
    Alert.alert('Error', 'Gagal memilih gambar dari galeri');
    return null;
  }
};

/**
 * Take photo with camera
 */
export const takePhotoWithCamera = async (): Promise<ImagePickerResult | null> => {
  try {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) {
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: asset.type || 'image',
      };
    }

    return null;
  } catch (error) {
    console.error('Error taking photo with camera:', error);
    Alert.alert('Error', 'Gagal mengambil foto');
    return null;
  }
};

/**
 * Show image picker options (Gallery or Camera)
 */
export const showImagePickerOptions = (): Promise<'gallery' | 'camera' | null> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Pilih Sumber Gambar',
      'Pilih dari mana Anda ingin mengambil gambar',
      [
        {
          text: 'Galeri',
          onPress: () => resolve('gallery'),
        },
        {
          text: 'Kamera',
          onPress: () => resolve('camera'),
        },
        {
          text: 'Batal',
          onPress: () => resolve(null),
          style: 'cancel',
        },
      ]
    );
  });
};

/**
 * Main function to pick/take image with options dialog
 */
export const selectImage = async (): Promise<ImagePickerResult | null> => {
  const source = await showImagePickerOptions();
  
  if (!source) {
    return null;
  }

  if (source === 'gallery') {
    return await pickImageFromGallery();
  } else {
    return await takePhotoWithCamera();
  }
};

/**
 * Example usage in a component:
 * 
 * import { selectImage } from '@/utils/imagePickerUtils';
 * import { uploadImageToCloudinary } from '@/services/cloudinaryService';
 * 
 * const handleSelectImage = async () => {
 *   const image = await selectImage();
 *   if (image) {
 *     setLoading(true);
 *     try {
 *       const imageUrl = await uploadImageToCloudinary(image.uri, {
 *         folder: 'geo-contextual-app/jurnal',
 *         tags: ['jurnal', userId]
 *       });
 *       setImageUrl(imageUrl);
 *     } catch (error) {
 *       Alert.alert('Error', 'Gagal upload gambar');
 *     } finally {
 *       setLoading(false);
 *     }
 *   }
 * };
 */
