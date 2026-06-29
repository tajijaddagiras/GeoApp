import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Card } from '../../components/Card';
import { Level } from '../../types';
import { getAllLevels, deleteLevel } from '../../services/firebaseService';

interface KelolaLevelScreenProps {
  navigation: any;
}

export const KelolaLevelScreen: React.FC<KelolaLevelScreenProps> = ({ navigation }) => {
  const [levelList, setLevelList] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadLevels();
    }, [])
  );

  const loadLevels = async () => {
    try {
      setLoading(true);
      const data = await getAllLevels();
      setLevelList(data);
    } catch (error) {
      console.error('Load levels error:', error);
      Alert.alert('Error', 'Gagal memuat data level');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigation.navigate('FormLevel', {});
  };

  const handleEdit = (level: Level) => {
    navigation.navigate('FormLevel', { level });
  };

  const handleDelete = (level: Level) => {
    Alert.alert(
      'Hapus Level',
      `Apakah Anda yakin ingin menghapus "${level.nama}"?\n\nPerhatian: Soal yang menggunakan level ini tidak akan terhapus, namun tidak lagi memiliki level.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteLevel(level.id);
              await loadLevels();
              Alert.alert('Berhasil', 'Level berhasil dihapus');
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus level');
            }
          },
        },
      ]
    );
  };

  const renderLevelItem = ({ item }: { item: Level }) => (
    <Card style={styles.levelCard}>
      <View style={styles.levelHeader}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>⭐</Text>
        </View>
        <View style={styles.levelInfo}>
          <Text style={styles.levelNama}>{item.nama}</Text>
          <View style={styles.levelStats}>
            <View style={styles.statChip}>
              <Text style={styles.statChipText}>⏱️ {item.durasiMenit} menit</Text>
            </View>
            <View style={[styles.statChip, styles.statChipGreen]}>
              <Text style={styles.statChipText}>🏆 {item.poinPerSoal} poin/soal</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.levelActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.actionButtonText}>✏️ Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.actionButtonText}>🗑️ Hapus</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kelola Level</Text>
        <Text style={styles.headerSubtitle}>Atur level kuis, poin, dan durasi waktu</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.toolbar}>
          <Text style={styles.countText}>{levelList.length} Level terdaftar</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.earthBrown} />
          </View>
        ) : levelList.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>⭐</Text>
            <Text style={styles.emptyText}>Belum ada level</Text>
            <Text style={styles.emptySubtext}>Tap tombol + untuk menambah level kuis</Text>
          </View>
        ) : (
          <FlatList
            data={levelList}
            renderItem={renderLevelItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      <TouchableOpacity style={styles.fab} onPress={handleAdd}>
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
    backgroundColor: Colors.earthBrown,
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
  },
  toolbar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  countText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.medium,
    color: Colors.charcoalText,
  },
  listContent: {
    padding: 20,
  },
  levelCard: {
    marginBottom: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.mustard + '40',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  levelBadgeText: {
    fontSize: 24,
  },
  levelInfo: {
    flex: 1,
  },
  levelNama: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
    marginBottom: 8,
  },
  levelStats: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statChip: {
    backgroundColor: Colors.softBlue + '25',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statChipGreen: {
    backgroundColor: Colors.successGreen + '25',
  },
  statChipText: {
    fontSize: Typography.sizes.caption,
    color: Colors.charcoalText,
    fontWeight: Typography.weights.medium,
  },
  levelActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: Colors.softBlue + '30',
  },
  deleteButton: {
    backgroundColor: Colors.alertRed + '20',
  },
  actionButtonText: {
    fontSize: Typography.sizes.subheading,
    fontWeight: Typography.weights.medium,
    color: Colors.earthBrown,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.deepTeal,
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
