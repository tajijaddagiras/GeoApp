import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/Card';
import { getAllMateri, getProgressByUserId } from '../../services/firebaseService';

const { width } = Dimensions.get('window');

interface MateriItem {
  id: string;
  title: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  order: number;
  icon: string;
}

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const [materiList, setMateriList] = useState<MateriItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user])
  );

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const materis = await getAllMateri();
      const progres = await getProgressByUserId(user.id);
      
      const materiWithStatus = materis.map((m, index) => {
        const userProgress = progres.find(p => p.materiId === m.id);
        let status: 'locked' | 'available' | 'in_progress' | 'completed' = 'locked';
        
        if (index === 0) {
          status = 'available';
        } else if (userProgress) {
          status = userProgress.status;
        } else {
          const prevMateri = materis[index - 1];
          const prevProgress = progres.find(p => p.materiId === prevMateri.id);
          if (prevProgress?.status === 'completed') {
            status = 'available';
          }
        }
        
        return {
          id: m.id,
          title: m.title,
          status,
          order: m.order,
          icon: getIcon(m.title),
        };
      });
      
      setMateriList(materiWithStatus);
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (title: string): string => {
    if (title.toLowerCase().includes('dasar')) return '🗺️';
    if (title.toLowerCase().includes('litosfer')) return '🏔️';
    if (title.toLowerCase().includes('atmosfer')) return '☁️';
    if (title.toLowerCase().includes('hidrosfer')) return '🌊';
    return '📚';
  };

  const getStatusColor = (status: MateriItem['status']) => {
    switch (status) {
      case 'completed':
        return Colors.successGreen;
      case 'in_progress':
        return Colors.mustard;
      case 'available':
        return Colors.softBlue;
      case 'locked':
        return Colors.lightGray;
      default:
        return Colors.lightGray;
    }
  };

  const getStatusIcon = (status: MateriItem['status']) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in_progress':
        return '▶';
      case 'available':
        return '📍';
      case 'locked':
        return '🔒';
      default:
        return '';
    }
  };

  const handleMateriPress = (materi: MateriItem) => {
    if (materi.status === 'locked') {
      return; // Show tooltip in future
    }
    navigation.navigate('DetailMateri', { materiId: materi.id });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Loading...</Text>
          </View>
        </View>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.deepTeal} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo, {user?.name}!</Text>
          <Text style={styles.subtitle}>Lanjutkan eksplorasi geografimu</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>Peta Eksplorasi</Text>
          <Text style={styles.sectionSubtitle}>Jelajahi topik geografi secara berurutan</Text>

          <View style={styles.pathContainer}>
            {materiList.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>🗺️</Text>
                <Text style={{ fontSize: Typography.sizes.body, fontWeight: Typography.weights.bold, color: Colors.earthBrown, textAlign: 'center' }}>Belum Ada Materi</Text>
                <Text style={{ fontSize: Typography.sizes.caption, color: Colors.charcoalText, textAlign: 'center', opacity: 0.7, marginTop: 4 }}>Peta eksplorasi masih kosong. Tunggu admin menambahkan materi pembelajaran.</Text>
              </View>
            ) : (
              materiList.map((materi, index) => (
                <View key={materi.id} style={styles.pathItem}>
                  {index > 0 && <View style={styles.pathLine} />}
                  <TouchableOpacity
                    style={[
                      styles.checkpoint,
                      { backgroundColor: getStatusColor(materi.status) },
                      materi.status === 'locked' && styles.checkpointLocked,
                    ]}
                    onPress={() => handleMateriPress(materi)}
                    disabled={materi.status === 'locked'}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.checkpointIcon}>{materi.icon}</Text>
                    <Text style={styles.statusBadge}>{getStatusIcon(materi.status)}</Text>
                  </TouchableOpacity>
                  <View style={styles.materiInfo}>
                    <Text style={styles.materiTitle}>{materi.title}</Text>
                    <Text style={styles.materiStatus}>
                      {materi.status === 'locked' && 'Terkunci'}
                      {materi.status === 'available' && 'Tersedia'}
                      {materi.status === 'in_progress' && 'Sedang Belajar'}
                      {materi.status === 'completed' && 'Selesai'}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Akses Cepat</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('PetaInteraktif')}
            >
              <Text style={styles.actionIcon}>📍</Text>
              <Text style={styles.actionTitle}>Peta Interaktif</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('ZonaWaktu')}
            >
              <Text style={styles.actionIcon}>🌍</Text>
              <Text style={styles.actionTitle}>Zona Waktu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Jurnal')}
            >
              <Text style={styles.actionIcon}>📔</Text>
              <Text style={styles.actionTitle}>Jurnal Saya</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionTitle}>Progres</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.sageTeal,
  },
  greeting: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
    color: Colors.creamWhite,
  },
  subtitle: {
    fontSize: Typography.sizes.subheading,
    color: Colors.warmSand,
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.warmSand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mapContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
    opacity: 0.7,
    marginBottom: 20,
  },
  pathContainer: {
    paddingVertical: 20,
  },
  pathItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  pathLine: {
    position: 'absolute',
    left: 35,
    top: -20,
    width: 2,
    height: 20,
    backgroundColor: Colors.borderSubtle,
  },
  checkpoint: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  checkpointLocked: {
    opacity: 0.5,
  },
  checkpointIcon: {
    fontSize: 32,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontSize: 16,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 2,
  },
  materiInfo: {
    flex: 1,
    marginLeft: 16,
  },
  materiTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
    marginBottom: 4,
  },
  materiStatus: {
    fontSize: Typography.sizes.caption,
    color: Colors.charcoalText,
    opacity: 0.7,
  },
  quickActions: {
    marginTop: 32,
    marginBottom: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: Colors.warmSand,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: Typography.sizes.subheading,
    fontWeight: Typography.weights.medium,
    color: Colors.earthBrown,
    textAlign: 'center',
  },
});
