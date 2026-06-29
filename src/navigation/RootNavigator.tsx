import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { AuthStack } from './AuthStack';
import { UserStack } from './UserStack';
import { AdminStack } from './AdminStack';
import { useAuthStore } from '../store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { user, setUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Wait for splash screen
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Check onboarding status
      // DEVELOPMENT: Uncomment line below to reset onboarding (see it again)
      // await AsyncStorage.removeItem('hasSeenOnboarding');
      
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }

      // Check Firebase auth state
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: userDoc.id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              nisn: userData.nisn,
              kelas: userData.kelas,
              createdAt: userData.createdAt?.toDate() || new Date(),
            });
          }
        } else {
          setUser(null);
        }
        setShowSplash(false);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      setShowSplash(false);
      setIsLoading(false);
    }
  };

  const handleOnboardingFinish = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (showSplash || isLoading) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onFinish={handleOnboardingFinish} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : user?.role === 'admin' ? (
          <Stack.Screen name="AdminApp" component={AdminStack} />
        ) : (
          <Stack.Screen name="UserApp" component={UserStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
