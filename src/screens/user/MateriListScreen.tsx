import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Card } from '../../components/Card';
import { getAllMateri } from '../../services/firebaseService';
import { Materi } from '../../types';

interface MateriListScreenProps {
  navigation: any;
}

export const MateriListScreen: React.FC<MateriListScreenProps> = ({ navigation }) => {
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadMateri();
    }, [])
  );

  const loadMateri = async () => {
    try {
      setLoading(true);
      const data = await getAllMateri();
      setMateriList(data);
    } catch (error) {
      console.error('Error fetching materi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMateriPress = (materiId: string) => {
    navigation.navigate('DetailMateri', { materiId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.deepTeal} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Materi</Text>
        <Text style={styles.headerSubtitle}>Pilih materi untuk mulai belajar</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {materiList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>Belum ada materi yang tersedia.</Text>
            <Text style={styles.emptySubtext}>Materi akan muncul di sini setelah ditambahkan oleh admin.</Text>
          </View>
        ) : (
          materiList.map((materi) => (
            <TouchableOpacity 
              key={materi.id} 
              onPress={() => handleMateriPress(materi.id!)}
              activeOpacity={0.7}
            >
              <Card style={styles.materiCard}>
                <View style={styles.materiIconContainer}>
                  <Text style={styles.materiIcon}>📖</Text>
                </View>
                <View style={styles.materiInfo}>
                  <Text style={styles.materiTitle}>{materi.title}</Text>
                  <Text style={styles.materiKd} numberOfLines={1}>{materi.kd}</Text>
                </View>
                <Text style={styles.arrowIcon}>→</Text>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamWhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.creamWhite,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.sageTeal,
  },
  headerTitle: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
    color: Colors.creamWhite,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.subheading,
    color: Colors.warmSand,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    padding: 20,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: Typography.sizes.body,
    color: Colors.charcoalText,
    textAlign: 'center',
    opacity: 0.7,
  },
  materiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
  },
  materiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.softBlue + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  materiIcon: {
    fontSize: 24,
  },
  materiInfo: {
    flex: 1,
  },
  materiTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
    marginBottom: 4,
  },
  materiKd: {
    fontSize: Typography.sizes.caption,
    color: Colors.charcoalText,
    opacity: 0.8,
  },
  arrowIcon: {
    fontSize: 20,
    color: Colors.deepTeal,
    marginLeft: 8,
  },
});
