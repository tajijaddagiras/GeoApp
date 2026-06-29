import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🗺️</Text>
        <Text style={styles.appName}>GEO EXPLORER</Text>
        <Text style={styles.subtitle}>Jelajahi Dunia Geografi</Text>
      </View>
      <ActivityIndicator size="large" color={Colors.mustard} style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.sageTeal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 80,
    marginBottom: 20,
  },
  appName: {
    fontSize: Typography.sizes.hero,
    fontWeight: Typography.weights.bold,
    color: Colors.creamWhite,
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Typography.sizes.body,
    color: Colors.warmSand,
    opacity: 0.9,
  },
  loader: {
    position: 'absolute',
    bottom: 50,
  },
});
