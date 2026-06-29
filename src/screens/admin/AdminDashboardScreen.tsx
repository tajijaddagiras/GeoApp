import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Card } from '../../components/Card';
import { getStatistics } from '../../services/firebaseService';

const { width } = Dimensions.get('window');

interface AdminDashboardScreenProps {
  navigation: any;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalPengguna: 0,
    penggunaAktif: 0,
    totalMateri: 0,
    totalSoal: 0,
    rataRataProgres: 0,
    rataRataNilai: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getStatistics();
      setStats(data);
    } catch (error) {
      console.error('Load stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentActivity = [
    { id: '1', user: 'Ahmad Fauzi', action: 'Menyelesaikan kuis Litosfer', time: '10 menit lalu' },
    { id: '2', user: 'Siti Nurhaliza', action: 'Membuat jurnal baru', time: '25 menit lalu' },
    { id: '3', user: 'Budi Santoso', action: 'Mengakses materi Hidrosfer', time: '1 jam lalu' },
    { id: '4', user: 'Dewi Lestari', action: 'Menyelesaikan kuis Atmosfer', time: '2 jam lalu' },
  ];

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card style={[styles.statCard, { borderLeftWidth: 4, borderLeftColor: color }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Dashboard Admin</Text>
            <Text style={styles.subtitle}>Kelola & Monitor Sistem</Text>
          </View>
        </View>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.earthBrown} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Dashboard Admin</Text>
          <Text style={styles.subtitle}>Kelola & Monitor Sistem</Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Text style={styles.notifIcon}>🔔</Text>
          <View style={styles.notifBadge}>
            <Text style={styles.notifBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Statistik Ringkas</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Pengguna"
            value={stats.totalPengguna}
            icon="👥"
            color={Colors.deepTeal}
          />
          <StatCard
            title="Pengguna Aktif"
            value={stats.penggunaAktif}
            icon="✓"
            color={Colors.successGreen}
          />
          <StatCard
            title="Total Materi"
            value={stats.totalMateri}
            icon="📚"
            color={Colors.softBlue}
          />
          <StatCard
            title="Total Soal"
            value={stats.totalSoal}
            icon="📝"
            color={Colors.mustard}
          />
        </View>

        <View style={styles.progressSection}>
          <Card>
            <Text style={styles.cardTitle}>Rata-rata Progres Pengguna</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${stats.rataRataProgres}%` }]} />
            </View>
            <Text style={styles.progressText}>{stats.rataRataProgres}%</Text>
          </Card>

          <Card style={styles.scoreCard}>
            <Text style={styles.cardTitle}>Rata-rata Nilai Kuis</Text>
            <Text style={styles.scoreValue}>{stats.rataRataNilai}</Text>
            <Text style={styles.scoreLabel}>dari 100</Text>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Akses Cepat</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('KelolaMateri')}
          >
            <Text style={styles.quickActionIcon}>📚</Text>
            <Text style={styles.quickActionText}>Kelola Materi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('KelolaSoal')}
          >
            <Text style={styles.quickActionIcon}>📝</Text>
            <Text style={styles.quickActionText}>Kelola Soal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('KelolaPengguna')}
          >
            <Text style={styles.quickActionIcon}>👥</Text>
            <Text style={styles.quickActionText}>Kelola Pengguna</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
          >
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={styles.quickActionText}>Rekap Nilai</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
        <Card>
          {recentActivity.map((activity, index) => (
            <View
              key={activity.id}
              style={[
                styles.activityItem,
                index < recentActivity.length - 1 && styles.activityItemBorder,
              ]}
            >
              <View style={styles.activityIcon}>
                <Text>📌</Text>
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityUser}>{activity.user}</Text>
                <Text style={styles.activityAction}>{activity.action}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </Card>

        <View style={styles.spacer} />
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
    backgroundColor: Colors.earthBrown,
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
  notifButton: {
    position: 'relative',
    padding: 8,
  },
  notifIcon: {
    fontSize: 28,
  },
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.alertRed,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadgeText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
    marginTop: 24,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 20,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: Typography.sizes.caption,
    color: Colors.charcoalText,
    textAlign: 'center',
  },
  progressSection: {
    marginTop: 8,
  },
  cardTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
    marginBottom: 12,
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
    backgroundColor: Colors.deepTeal,
  },
  progressText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.deepTeal,
    textAlign: 'center',
  },
  scoreCard: {
    marginTop: 16,
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: Typography.weights.bold,
    color: Colors.successGreen,
  },
  scoreLabel: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
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
  quickActionIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: Typography.sizes.subheading,
    fontWeight: Typography.weights.medium,
    color: Colors.earthBrown,
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  activityIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.creamWhite,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityUser: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
    marginBottom: 2,
  },
  activityAction: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: Typography.sizes.caption,
    color: Colors.gray,
  },
  spacer: {
    height: 40,
  },
});
