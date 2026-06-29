import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
// For production, use environment variables or secure config management
const firebaseConfig = {
  apiKey: "AIzaSyA4FR7OBfReKwqZWS6YobTpm04US28FCC0",
  authDomain: "geo-app-e97db.firebaseapp.com",
  projectId: "geo-app-e97db",
  storageBucket: "geo-app-e97db.firebasestorage.app",
  messagingSenderId: "871178476690",
  appId: "1:871178476690:web:0fa2ff62d4d94453e71a4b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);

export { setDoc };

export default app;
