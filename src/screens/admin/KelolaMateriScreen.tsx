import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Card } from '../../components/Card';
import { Materi } from '../../types';
import { getAllMateri, deleteMateri } from '../../services/firebaseService';

interface KelolaMateriScreenProps {
  navigation: any;
}

export const KelolaMateriScreen: React.FC<KelolaMateriScreenProps> = ({ navigation }) => {
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMateri();
  }, []);

  const loadMateri = async () => {
    try {
      setLoading(true);
      const data = await getAllMateri();
      setMateriList(data);
    } catch (error) {
      console.error('Load materi error:', error);
      Alert.alert('Error', 'Gagal memuat data materi');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigation.navigate('FormMateri', {});
  };

  const handleEdit = (materi: Materi) => {
    navigation.navigate('FormMateri', { materi });
  };

  const handleDelete = (materi: Materi) => {
    Alert.alert(
      'Hapus Materi',
      `Apakah Anda yakin ingin menghapus "${materi.title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMateri(materi.id);
              await loadMateri();
              Alert.alert('Berhasil', 'Materi berhasil dihapus');
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus materi');
            }
          },
        },
      ]
    );
  };

  const renderMateriItem = ({ item }: { item: Materi }) => (
    <Card style={styles.materiCard}>
      <View style={styles.materiHeader}>
        <View style={styles.orderBadge}>
          <Text style={styles.orderText}>{item.order}</Text>
        </View>
        <View style={styles.materiInfo}>
          <Text style={styles.materiTitle}>{item.title}</Text>
          <Text style={styles.materiKD}>{item.kd}</Text>
          <Text style={styles.materiPreview} numberOfLines={2}>
            {item.konsep}
          </Text>
        </View>
      </View>

      <View style={styles.materiActions}>
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
        <Text style={styles.headerTitle}>Kelola Materi</Text>
        <Text style={styles.headerSubtitle}>Tambah, edit, atau hapus materi pembelajaran</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.toolbar}>
          <Text style={styles.countText}>{materiList.length} Materi</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.earthBrown} />
          </View>
        ) : materiList.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>Belum ada materi</Text>
            <Text style={styles.emptySubtext}>Tap tombol + untuk menambah materi baru</Text>
          </View>
        ) : (
          <FlatList
            data={materiList}
            renderItem={renderMateriItem}
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
  materiCard: {
    marginBottom: 16,
  },
  materiHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  orderBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.deepTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
  },
  materiInfo: {
    flex: 1,
  },
  materiTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
    marginBottom: 4,
  },
  materiKD: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium,
    color: Colors.softBlue,
    marginBottom: 6,
  },
  materiPreview: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
    lineHeight: 18,
  },
  materiActions: {
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
