import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Card } from '../../components/Card';
import { Soal, Materi } from '../../types';
import { getAllMateri, getSoalByMateriId, deleteSoal } from '../../services/firebaseService';

interface KelolaSoalScreenProps {
  navigation: any;
}

export const KelolaSoalScreen: React.FC<KelolaSoalScreenProps> = ({ navigation }) => {
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [selectedMateri, setSelectedMateri] = useState<string | null>(null);
  const [soalList, setSoalList] = useState<Soal[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSoal, setLoadingSoal] = useState(false);

  useEffect(() => {
    loadMateri();
  }, []);

  const loadMateri = async () => {
    try {
      setLoading(true);
      const data = await getAllMateri();
      setMateriList(data);
      if (data.length > 0) {
        setSelectedMateri(data[0].id);
        loadSoal(data[0].id);
      }
    } catch (error) {
      console.error('Load materi error:', error);
      Alert.alert('Error', 'Gagal memuat data materi');
    } finally {
      setLoading(false);
    }
  };

  const loadSoal = async (materiId: string) => {
    try {
      setLoadingSoal(true);
      const data = await getSoalByMateriId(materiId);
      setSoalList(data);
    } catch (error) {
      console.error('Load soal error:', error);
      Alert.alert('Error', 'Gagal memuat data soal');
    } finally {
      setLoadingSoal(false);
    }
  };

  const handleMateriSelect = (materiId: string) => {
    setSelectedMateri(materiId);
    loadSoal(materiId);
  };

  const handleAdd = () => {
    if (!selectedMateri) {
      Alert.alert('Error', 'Pilih materi terlebih dahulu');
      return;
    }
    navigation.navigate('FormSoal', { materiId: selectedMateri });
  };

  const handleEdit = (soal: Soal) => {
    navigation.navigate('FormSoal', { soal, materiId: soal.materiId });
  };

  const handleDelete = (soal: Soal) => {
    Alert.alert(
      'Hapus Soal',
      `Apakah Anda yakin ingin menghapus soal nomor ${soal.order}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSoal(soal.id);
              if (selectedMateri) {
                await loadSoal(selectedMateri);
              }
              Alert.alert('Berhasil', 'Soal berhasil dihapus');
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus soal');
            }
          },
        },
      ]
    );
  };

  const renderSoalItem = ({ item }: { item: Soal }) => (
    <Card style={styles.soalCard}>
      <View style={styles.soalHeader}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{item.order}</Text>
        </View>
        <View style={styles.soalInfo}>
          <Text style={styles.soalText} numberOfLines={2}>
            {item.pertanyaan}
          </Text>
          <Text style={styles.answerKey}>Jawaban: {item.jawabanBenar}</Text>
        </View>
      </View>

      <View style={styles.soalActions}>
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.earthBrown} />
      </View>
    );
  }

  const selectedMateriData = materiList.find(m => m.id === selectedMateri);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kelola Soal</Text>
        <Text style={styles.headerSubtitle}>Manajemen soal kuis per materi</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.materiSelector}>
          <Text style={styles.selectorLabel}>Pilih Materi:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.materiScroll}>
            {materiList.map((materi) => (
              <TouchableOpacity
                key={materi.id}
                style={[
                  styles.materiChip,
                  selectedMateri === materi.id && styles.materiChipSelected,
                ]}
                onPress={() => handleMateriSelect(materi.id)}
              >
                <Text
                  style={[
                    styles.materiChipText,
                    selectedMateri === materi.id && styles.materiChipTextSelected,
                  ]}
                  numberOfLines={1}
                >
                  {materi.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {selectedMateriData && (
          <View style={styles.toolbar}>
            <View>
              <Text style={styles.toolbarTitle}>{selectedMateriData.title}</Text>
              <Text style={styles.countText}>{soalList.length} Soal</Text>
            </View>
          </View>
        )}

        {loadingSoal ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.earthBrown} />
          </View>
        ) : soalList.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>Belum ada soal</Text>
            <Text style={styles.emptySubtext}>Tap tombol + untuk menambah soal</Text>
          </View>
        ) : (
          <FlatList
            data={soalList}
            renderItem={renderSoalItem}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  materiSelector: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  selectorLabel: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.medium,
    color: Colors.charcoalText,
    marginBottom: 12,
  },
  materiScroll: {
    flexDirection: 'row',
  },
  materiChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.creamWhite,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginRight: 8,
    maxWidth: 200,
  },
  materiChipSelected: {
    backgroundColor: Colors.deepTeal,
    borderColor: Colors.deepTeal,
  },
  materiChipText: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
  },
  materiChipTextSelected: {
    color: Colors.white,
    fontWeight: Typography.weights.semibold,
  },
  toolbar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  toolbarTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
    marginBottom: 4,
  },
  countText: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
  },
  listContent: {
    padding: 20,
  },
  soalCard: {
    marginBottom: 16,
  },
  soalHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.mustard,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
  },
  soalInfo: {
    flex: 1,
  },
  soalText: {
    fontSize: Typography.sizes.body,
    color: Colors.earthBrown,
    marginBottom: 4,
    lineHeight: 20,
  },
  answerKey: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.successGreen,
  },
  soalActions: {
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
