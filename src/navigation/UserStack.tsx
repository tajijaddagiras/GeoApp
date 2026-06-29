import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Colors } from '../constants/colors';
import { DashboardScreen } from '../screens/user/DashboardScreen';
import { JurnalScreen } from '../screens/user/JurnalScreen';
import { ProfileScreen } from '../screens/user/ProfileScreen';
import { DetailMateriScreen } from '../screens/user/DetailMateriScreen';
import { KuisScreen } from '../screens/user/KuisScreen';
import { FormJurnalScreen } from '../screens/user/FormJurnalScreen';
import { PetaInteraktifScreen } from '../screens/user/PetaInteraktifScreen';
import { ZonaWaktuScreen } from '../screens/user/ZonaWaktuScreen';

import { MateriListScreen } from '../screens/user/MateriListScreen';

// Tab icon component
const TabIcon = ({ emoji, size }: { emoji: string; size: number }) => (
  <Text style={{ fontSize: size }}>{emoji}</Text>
);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.earthBrown,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.warmSand,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: Colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Eksplorasi',
          tabBarIcon: ({ size }) => <TabIcon emoji="🗺️" size={size} />,
        }}
      />
      <Tab.Screen
        name="Materi"
        component={MateriListScreen}
        options={{
          tabBarLabel: 'Materi',
          tabBarIcon: ({ size }) => <TabIcon emoji="📖" size={size} />,
        }}
      />
      <Tab.Screen
        name="PetaInteraktif"
        component={PetaInteraktifScreen}
        options={{
          tabBarLabel: 'Peta',
          tabBarIcon: ({ size }) => <TabIcon emoji="📍" size={size} />,
        }}
      />
      <Tab.Screen
        name="Jurnal"
        component={JurnalScreen}
        options={{
          tabBarLabel: 'Jurnal',
          tabBarIcon: ({ size }) => <TabIcon emoji="📔" size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ size }) => <TabIcon emoji="👤" size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Stack Navigator that wraps the tabs
export const UserStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="DetailMateri" component={DetailMateriScreen} />
      <Stack.Screen name="Kuis" component={KuisScreen} />
      <Stack.Screen name="FormJurnal" component={FormJurnalScreen} />
      <Stack.Screen name="ZonaWaktu" component={ZonaWaktuScreen} />
    </Stack.Navigator>
  );
};

