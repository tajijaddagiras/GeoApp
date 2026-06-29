import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import { getProgressByUserId, getJurnalByUserId, getAllMateri } from '../../services/firebaseService';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({
    totalTopik: 0,
    selesai: 0,
    sedangBelajar: 0,
    terkunci: 0,
    persentase: 0,
    totalKuis: 0,
    rataRataNilai: 0,
    totalJurnal: 0,
    badge: ['🥉 Pemula'],
  });

  useEffect(() => {
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [progres, jurnal, materis] = await Promise.all([
        getProgressByUserId(user.id),
        getJurnalByUserId(user.id),
        getAllMateri(),
      ]);

      const completed = progres.filter(p => p.status === 'completed').length;
      const inProgress = progres.filter(p => p.status === 'in_progress').length;
      const locked = materis.length - completed - inProgress;
      const percentage = materis.length > 0 ? Math.round((completed / materis.length) * 100) : 0;

      // Calculate average score
      const scoresWithValue = progres.filter(p => p.skor !== undefined && p.skor > 0);
      const avgScore = scoresWithValue.length > 0
        ? Math.round(scoresWithValue.reduce((sum, p) => sum + (p.skor || 0), 0) / scoresWithValue.length)
        : 0;

      // Determine badges
      const badges = ['🥉 Pemula'];
      if (completed >= 3) badges.push('📚 Rajin Belajar');
      if (completed >= 5) badges.push('🏆 Master Geografi');
      if (jurnal.length >= 5) badges.push('✍️ Penulis Aktif');
      if (avgScore >= 80) badges.push('⭐ Nilai Bagus');

      setProgressData({
        totalTopik: materis.length,
        selesai: completed,
        sedangBelajar: inProgress,
        terkunci: locked,
        persentase: percentage,
        totalKuis: scoresWithValue.length,
        rataRataNilai: avgScore,
        totalJurnal: jurnal.length,
        badge: badges,
      });
    } catch (error) {
      console.error('Load profile data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Keluar',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.sageTeal} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.info}>{user?.kelas || 'Kelas tidak tersedia'}</Text>
        <Text style={styles.info}>{user?.nisn || user?.email}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.progressCard}>
          <Text style={styles.cardTitle}>Progres Belajar</Text>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressData.persentase}%` }]} />
          </View>
          <Text style={styles.progressText}>{progressData.persentase}% Selesai</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{progressData.selesai}</Text>
              <Text style={styles.statLabel}>Topik Selesai</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{progressData.sedangBelajar}</Text>
              <Text style={styles.statLabel}>Sedang Belajar</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{progressData.terkunci}</Text>
              <Text style={styles.statLabel}>Terkunci</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Statistik Kuis</Text>
          <View style={styles.statRow}>
            <Text style={styles.statRowLabel}>Total Kuis Dikerjakan</Text>
            <Text style={styles.statRowValue}>{progressData.totalKuis}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statRowLabel}>Rata-rata Nilai</Text>
            <Text style={[styles.statRowValue, { color: Colors.successGreen }]}>
              {progressData.rataRataNilai}
            </Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Jurnal Refleksi</Text>
          <View style={styles.statRow}>
            <Text style={styles.statRowLabel}>Total Jurnal</Text>
            <Text style={styles.statRowValue}>{progressData.totalJurnal}</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Badge Pencapaian</Text>
          <View style={styles.badgeContainer}>
            {progressData.badge.map((badge, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Pengaturan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>❓</Text>
            <Text style={styles.actionText}>Bantuan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>ℹ️</Text>
            <Text style={styles.actionText}>Tentang Aplikasi</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Keluar"
          onPress={handleLogout}
          variant="destructive"
          style={styles.logoutButton}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Geo-Contextual App v1.0.0</Text>
          <Text style={styles.footerText}>© 2026 MAN 1 Pekanbaru</Text>
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
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    backgroundColor: Colors.sageTeal,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.warmSand,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
  },
  name: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
    color: Colors.creamWhite,
    marginBottom: 4,
  },
  info: {
    fontSize: Typography.sizes.subheading,
    color: Colors.warmSand,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  progressCard: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
    marginBottom: 16,
  },
  progressBar: {
    height: 12,
    backgroundColor: Colors.borderSubtle,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.successGreen,
  },
  progressText: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
    textAlign: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: Typography.weights.bold,
    color: Colors.deepTeal,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.charcoalText,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  statRowLabel: {
    fontSize: Typography.sizes.body,
    color: Colors.charcoalText,
  },
  statRowValue: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: Colors.creamWhite,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: Typography.sizes.subheading,
    color: Colors.earthBrown,
  },
  actions: {
    marginTop: 8,
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  actionText: {
    fontSize: Typography.sizes.body,
    color: Colors.earthBrown,
  },
  logoutButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: Typography.sizes.caption,
    color: Colors.gray,
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
