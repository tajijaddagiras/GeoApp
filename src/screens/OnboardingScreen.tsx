import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Button } from '../components/Button';

const { width } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    icon: '🗺️',
    title: 'Jelajahi Geografi',
    description: 'Pelajari materi Geografi dengan cara yang menyenangkan melalui peta eksplorasi interaktif',
  },
  {
    id: '2',
    icon: '📍',
    title: 'Kontekstual Lokal',
    description: 'Temukan hubungan antara materi dengan fenomena geografis di sekitar Riau dan Pekanbaru',
  },
  {
    id: '3',
    icon: '📔',
    title: 'Refleksi Belajar',
    description: 'Catat perjalanan belajarmu dengan jurnal refleksi dan pantau progresmu',
  },
];

interface OnboardingScreenProps {
  onFinish: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={styles.slide}>
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Lewati</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {renderDots()}

      <View style={styles.buttonContainer}>
        <Button
          title={currentIndex === onboardingData.length - 1 ? 'Mulai' : 'Lanjut'}
          onPress={handleNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamWhite,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: 16,
    marginTop: 20,
  },
  skipText: {
    fontSize: Typography.sizes.body,
    color: Colors.earthBrown,
    fontWeight: Typography.weights.medium,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 100,
    marginBottom: 40,
  },
  title: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: Typography.sizes.body,
    color: Colors.charcoalText,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.mustard,
    width: 30,
  },
  inactiveDot: {
    backgroundColor: Colors.borderSubtle,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
});
