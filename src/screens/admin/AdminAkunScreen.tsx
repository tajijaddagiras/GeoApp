import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';

export const AdminAkunScreen: React.FC = () => {
  const { user, logout } = useAuthStore();

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Administrator'}</Text>
        <Text style={styles.info}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>Admin</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Pengaturan Admin</Text>
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
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: Colors.earthBrown,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: Colors.creamWhite,
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  actions: {
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
});
