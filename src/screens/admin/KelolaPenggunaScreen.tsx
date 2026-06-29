import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Card } from '../../components/Card';
import { User } from '../../types';
import { getAllUsers, deleteUser } from '../../services/firebaseService';

interface KelolaPenggunaScreenProps {
  navigation: any;
}

export const KelolaPenggunaScreen: React.FC<KelolaPenggunaScreenProps> = ({ navigation }) => {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUserList(data);
    } catch (error) {
      console.error('Load users error:', error);
      Alert.alert('Error', 'Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (user: User) => {
    if (user.role === 'admin') {
      Alert.alert('Tidak Diizinkan', 'Tidak dapat menghapus akun admin');
      return;
    }

    Alert.alert(
      'Hapus Pengguna',
      `Apakah Anda yakin ingin menghapus "${user.name}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(user.id);
              await loadUsers();
              Alert.alert('Berhasil', 'Pengguna berhasil dihapus');
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus pengguna');
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <Card style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name?.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{item.name}</Text>
            {item.role === 'admin' && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>Admin</Text>
              </View>
            )}
          </View>
          <Text style={styles.userEmail}>{item.email}</Text>
          {item.kelas && <Text style={styles.userKelas}>{item.kelas} • NISN: {item.nisn}</Text>}
          <Text style={styles.userDate}>Bergabung: {formatDate(item.createdAt)}</Text>
        </View>
      </View>

      {item.role !== 'admin' && (
        <View style={styles.userActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.actionButtonText}>🗑️ Hapus</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kelola Pengguna</Text>
        <Text style={styles.headerSubtitle}>Daftar semua pengguna aplikasi</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.toolbar}>
          <Text style={styles.countText}>
            {userList.length} Pengguna ({userList.filter(u => u.role === 'admin').length} Admin, {userList.filter(u => u.role === 'user').length} Siswa)
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.earthBrown} />
          </View>
        ) : userList.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>Belum ada pengguna</Text>
          </View>
        ) : (
          <FlatList
            data={userList}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
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
  userCard: {
    marginBottom: 16,
  },
  userHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.deepTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
    marginRight: 8,
  },
  adminBadge: {
    backgroundColor: Colors.mustard,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  adminBadgeText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
  },
  userEmail: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
    marginBottom: 2,
  },
  userKelas: {
    fontSize: Typography.sizes.caption,
    color: Colors.softBlue,
    marginBottom: 2,
  },
  userDate: {
    fontSize: Typography.sizes.caption,
    color: Colors.gray,
  },
  userActions: {
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
  },
});
