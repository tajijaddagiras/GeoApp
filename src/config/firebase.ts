import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore - firebase/auth types might not export this in some environments but it exists at runtime
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
// Using Expo's built-in environment variables prefixed with EXPO_PUBLIC_
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase safely (prevents 'already-initialized' error during Fast Refresh)
let app;
let auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  // Initialize Auth with AsyncStorage persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

// Initialize Firestore
export const db = getFirestore(app);

export { setDoc };

export default app;
