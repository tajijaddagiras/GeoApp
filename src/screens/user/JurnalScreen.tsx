import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Card } from '../../components/Card';
import { Jurnal, MoodType } from '../../types';
import { getJurnalByUserId } from '../../services/firebaseService';
import { useAuthStore } from '../../store/authStore';

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const getMoodEmoji = (mood: MoodType): string => {
  switch (mood) {
    case 'senang': return '😊';
    case 'netral': return '😐';
    case 'sedih': return '😢';
    case 'semangat': return '🔥';
    case 'bingung': return '🤔';
    default: return '😐';
  }
};

const getMoodColor = (mood: MoodType): string => {
  switch (mood) {
    case 'senang': return Colors.successGreen;
    case 'netral': return Colors.softBlue;
    case 'sedih': return Colors.coral;
    case 'semangat': return Colors.mustard;
    case 'bingung': return Colors.lightGray;
    default: return Colors.softBlue;
  }
};

interface JurnalScreenProps {
  navigation: any;
}

export const JurnalScreen: React.FC<JurnalScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [jurnalList, setJurnalList] = useState<Jurnal[]>([]);
  const [loading, setLoading] = useState(true);

  const years = [2024, 2025, 2026];

  useEffect(() => {
    loadJurnal();
  }, [user]);

  const loadJurnal = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getJurnalByUserId(user.id);
      setJurnalList(data);
    } catch (error) {
      console.error('Load jurnal error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJurnal = jurnalList.filter(jurnal => {
    const date = new Date(jurnal.createdAt);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });

  const handleJurnalPress = (jurnal: Jurnal) => {
    navigation.navigate('FormJurnal', { jurnal });
  };

  const handleAddJurnal = () => {
    navigation.navigate('FormJurnal', {});
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const renderJurnalItem = ({ item }: { item: Jurnal }) => (
    <TouchableOpacity onPress={() => handleJurnalPress(item)}>
      <Card style={styles.jurnalCard}>
        <View style={styles.jurnalContent}>
          <View
            style={[
              styles.moodIcon,
              { backgroundColor: getMoodColor(item.mood) },
            ]}
          >
            <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
          </View>
          <View style={styles.jurnalInfo}>
            <Text style={styles.jurnalTitle}>{item.judul}</Text>
            <Text style={styles.jurnalPreview} numberOfLines={2}>
              {item.isi}
            </Text>
            <Text style={styles.jurnalDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <TouchableOpacity style={styles.bookmarkIcon}>
            <Text style={styles.bookmarkText}>♥</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jurnal Refleksi</Text>
        <Text style={styles.headerSubtitle}>Catatan perjalanan belajarmu</Text>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Bulan</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {months.map((month, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tab,
                selectedMonth === index && styles.activeTab,
              ]}
              onPress={() => setSelectedMonth(index)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedMonth === index && styles.activeTabText,
                ]}
              >
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.filterLabel}>Tahun</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {years.map((year) => (
            <TouchableOpacity
              key={year}
              style={[
                styles.tab,
                selectedYear === year && styles.activeTab,
              ]}
              onPress={() => setSelectedYear(year)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedYear === year && styles.activeTabText,
                ]}
              >
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.sageTeal} />
          </View>
        ) : filteredJurnal.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📔</Text>
            <Text style={styles.emptyText}>Belum ada jurnal bulan ini</Text>
            <Text style={styles.emptySubtext}>Mulai tulis refleksi belajarmu!</Text>
          </View>
        ) : (
          <FlatList
            data={filteredJurnal}
            renderItem={renderJurnalItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      <TouchableOpacity style={styles.fab} onPress={handleAddJurnal}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  filterLabel: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium,
    color: Colors.charcoalText,
    marginBottom: 8,
    marginTop: 8,
  },
  tabsScroll: {
    marginBottom: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: Colors.mustard,
    borderColor: Colors.mustard,
  },
  tabText: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
  },
  activeTabText: {
    color: Colors.earthBrown,
    fontWeight: Typography.weights.semibold,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  jurnalCard: {
    marginBottom: 16,
  },
  jurnalContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  moodIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 24,
  },
  jurnalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  jurnalTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
    marginBottom: 4,
  },
  jurnalPreview: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
    lineHeight: 20,
    marginBottom: 8,
  },
  jurnalDate: {
    fontSize: Typography.sizes.caption,
    color: Colors.gray,
  },
  bookmarkIcon: {
    padding: 4,
  },
  bookmarkText: {
    fontSize: 20,
    color: Colors.coral,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
    opacity: 0.6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.earthBrown,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: Colors.creamWhite,
    lineHeight: 32,
  },
});
