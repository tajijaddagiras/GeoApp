import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { getMateriById, updateProgress } from '../../services/firebaseService';
import { useAuthStore } from '../../store/authStore';
import { Materi } from '../../types';

interface DetailMateriScreenProps {
  route: any;
  navigation: any;
}

export const DetailMateriScreen: React.FC<DetailMateriScreenProps> = ({ route, navigation }) => {
  const { materiId } = route.params;
  const { user } = useAuthStore();
  const [materi, setMateri] = useState<Materi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMateri();
  }, [materiId]);

  const loadMateri = async () => {
    try {
      setLoading(true);
      const data = await getMateriById(materiId);
      setMateri(data);
      
      // Update progress to in_progress
      if (user?.id && data) {
        await updateProgress(user.id, materiId, { status: 'in_progress' });
      }
    } catch (error) {
      console.error('Load materi error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartKuis = () => {
    navigation.navigate('Kuis', { materiId: materi?.id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.deepTeal} />
      </View>
    );
  }

  if (!materi) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Materi tidak ditemukan</Text>
        <Button title="Kembali" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{materi.title}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.kdCard}>
          <Text style={styles.kdLabel}>Kompetensi Dasar</Text>
          <Text style={styles.kdText}>{materi.kd}</Text>
        </Card>

        <Text style={styles.sectionTitle}>📖 Konsep Materi</Text>
        <Card>
          <Text style={styles.bodyText}>{materi.konsep}</Text>
        </Card>

        <Text style={styles.sectionTitle}>🌍 Studi Kasus Kontekstual</Text>
        <Text style={styles.sectionSubtitle}>Fenomena di Riau & Pekanbaru</Text>
        <Card style={styles.studiKasusCard}>
          <Text style={styles.bodyText}>{materi.studiKasus}</Text>
        </Card>

        {materi.imageUrl && (
          <>
            <Text style={styles.sectionTitle}>🖼️ Ilustrasi</Text>
            <Card>
              <Image source={{ uri: materi.imageUrl }} style={styles.image} />
            </Card>
          </>
        )}

        <View style={styles.actionSection}>
          <Button
            title="📝 Mulai Kuis"
            onPress={handleStartKuis}
            style={styles.kuisButton}
          />
          <Button
            title="📍 Lihat di Peta"
            onPress={() => alert('Fitur peta interaktif akan segera hadir!')}
            variant="secondary"
          />
        </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: Typography.sizes.body,
    color: Colors.alertRed,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.sageTeal,
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    fontSize: 28,
    color: Colors.creamWhite,
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.bold,
    color: Colors.creamWhite,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  kdCard: {
    backgroundColor: Colors.softBlue + '20',
    marginBottom: 24,
  },
  kdLabel: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.deepTeal,
    marginBottom: 4,
  },
  kdText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
  },
  sectionTitle: {
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
    marginBottom: 8,
    marginTop: 16,
  },
  sectionSubtitle: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
    opacity: 0.7,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: Typography.sizes.body,
    color: Colors.charcoalText,
    lineHeight: 24,
  },
  studiKasusCard: {
    backgroundColor: Colors.mustard + '15',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  actionSection: {
    marginTop: 32,
    marginBottom: 40,
  },
  kuisButton: {
    marginBottom: 12,
  },
});
