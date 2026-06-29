import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { Colors } from '../constants/colors';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { KelolaMateriScreen } from '../screens/admin/KelolaMateriScreen';
import { FormMateriScreen } from '../screens/admin/FormMateriScreen';
import { KelolaPenggunaScreen } from '../screens/admin/KelolaPenggunaScreen';
import { KelolaSoalScreen } from '../screens/admin/KelolaSoalScreen';
import { FormSoalScreen } from '../screens/admin/FormSoalScreen';
import { AdminAkunScreen } from '../screens/admin/AdminAkunScreen';

// Tab icon component
const TabIcon = ({ emoji, size }: { emoji: string; size: number }) => (
  <Text style={{ fontSize: size }}>{emoji}</Text>
);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Navigator
const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.creamWhite,
        tabBarInactiveTintColor: Colors.warmSand,
        tabBarStyle: {
          backgroundColor: Colors.earthBrown,
          borderTopWidth: 0,
          elevation: 8,
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
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ size }) => <TabIcon emoji="📊" size={size} />,
        }}
      />
      <Tab.Screen
        name="KelolaMateri"
        component={KelolaMateriScreen}
        options={{
          tabBarLabel: 'Materi',
          tabBarIcon: ({ size }) => <TabIcon emoji="📚" size={size} />,
        }}
      />
      <Tab.Screen
        name="KelolaSoal"
        component={KelolaSoalScreen}
        options={{
          tabBarLabel: 'Soal',
          tabBarIcon: ({ size }) => <TabIcon emoji="📝" size={size} />,
        }}
      />
      <Tab.Screen
        name="KelolaPengguna"
        component={KelolaPenggunaScreen}
        options={{
          tabBarLabel: 'Pengguna',
          tabBarIcon: ({ size }) => <TabIcon emoji="👥" size={size} />,
        }}
      />
      <Tab.Screen
        name="AdminAkun"
        component={AdminAkunScreen}
        options={{
          tabBarLabel: 'Akun',
          tabBarIcon: ({ size }) => <TabIcon emoji="⚙️" size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const AdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
      <Stack.Screen name="FormMateri" component={FormMateriScreen} />
      <Stack.Screen name="FormSoal" component={FormSoalScreen} />
    </Stack.Navigator>
  );
};

