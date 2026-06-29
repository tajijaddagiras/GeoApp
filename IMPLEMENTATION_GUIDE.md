# 🚀 GEO-CONTEXTUAL APP - IMPLEMENTATION GUIDE

## ✅ YANG SUDAH DIBUAT

1. ✅ `src/services/firebaseService.ts` - Lengkap dengan semua CRUD operations
2. ✅ `src/config/firebase.ts` - Updated dengan setDoc export
3. ✅ `src/types/index.ts` - Sudah lengkap semua interface

## 📋 YANG PERLU DILENGKAPI

### PHASE 1: UPDATE AUTHENTICATION & ROOT NAVIGATOR

File: `src/navigation/RootNavigator.tsx`

**Ganti fungsi handleSignIn dan handleSignUp dengan:**

```typescript
import { signIn, signUp, getCurrentUser } from '../services/firebaseService';

// Di dalam RootNavigator component:
useEffect(() => {
  checkAuth();
}, []);

const checkAuth = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    await checkOnboardingStatus();
  } catch (error) {
    console.error('Check auth error:', error);
    await checkOnboardingStatus();
  }
};

const handleSignIn = async (email: string, password: string) => {
  try {
    const user = await signIn(email, password);
    setUser(user);
  } catch (error: any) {
    throw error;
  }
};

const handleSignUp = async (data: any) => {
  try {
    const user = await signUp(data);
    setUser(user);
  } catch (error: any) {
    throw error;
  }
};
```

### PHASE 2: UPDATE AUTH SCREENS

**File: `src/screens/auth/SignInScreen.tsx`**

Update handleSignIn untuk catch error dengan benar dan tampilkan ke user.

**File: `src/screens/auth/SignUpScreen.tsx`**

Sudah OK, hanya pastikan error handling lengkap.

### PHASE 3: UPDATE DASHBOARD SCREEN (USER)

**File: `src/screens/user/DashboardScreen.tsx`**

Replace mock data dengan Firebase:

```typescript
import { useState, useEffect } from 'react';
import { getAllMateri } from '../../services/firebaseService';
import { getProgressByUserId } from '../../services/firebaseService';

// Di dalam component:
const [materiList, setMateriList] = useState<MateriItem[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadData();
}, [user]);

const loadData = async () => {
  try {
    setLoading(true);
    const materis = await getAllMateri();
    const progres = await getProgressByUserId(user?.id || '');
    
    // Map materis with progress status
    const materiWithStatus = materis.map((m, index) => {
      const userProgress = progres.find(p => p.materiId === m.id);
      let status: 'locked' | 'available' | 'in_progress' | 'completed' = 'locked';
      
      if (index === 0) {
        status = 'available'; // First topic always available
      } else if (userProgress) {
        status = userProgress.status;
      } else {
        // Check if previous topic completed
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
        icon: getIconForMateri(m.title),
      };
    });
    
    setMateriList(materiWithStatus);
  } catch (error) {
    console.error('Load data error:', error);
  } finally {
    setLoading(false);
  }
};

const getIconForMateri = (title: string): string => {
  if (title.toLowerCase().includes('dasar')) return '🗺️';
  if (title.toLowerCase().includes('litosfer')) return '🏔️';
  if (title.toLowerCase().includes('atmosfer')) return '☁️';
  if (title.toLowerCase().includes('hidrosfer')) return '🌊';
  if (title.toLowerCase().includes('lintang')) return '🌍';
  return '📚';
};
```

### PHASE 4: CREATE DETAIL MATERI SCREEN (IMPORTANT!)

**File: `src/screens/user/DetailMateriScreen.tsx`**

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
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
            onPress={() => navigation.navigate('PetaInteraktif', { materiId: materi.id })}
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
```

### PHASE 5: CREATE KUIS SCREEN

**File: `src/screens/user/KuisScreen.tsx`**

Ini screen untuk kuis dengan timer. (Terlalu panjang untuk satu pesan - akan saya buat dokumentasi terpisah)

### PHASE 6: UPDATE ADMIN SCREENS

**File: `src/screens/admin/KelolaMateriScreen.tsx`**

Replace mock data dengan Firebase getAllMateri, createMateri, updateMateri, deleteMateri.

**File: `src/screens/admin/AdminDashboardScreen.tsx`**

Replace mock stats dengan getStatistics dari firebaseService.

### PHASE 7: CREATE FORM SCREENS ADMIN

Perlu dibuat:
- TambahMateriScreen.tsx
- EditMateriScreen.tsx  
- KelolaSoalScreen.tsx
- TambahSoalScreen.tsx
- KelolaPenggunaScreen.tsx

## 🔥 SEED DATA FIREBASE

Untuk testing, tambahkan data sample ke Firestore:

**Collection: `materi`**
```json
{
  "title": "Pengetahuan Dasar Geografi",
  "kd": "KD 3.1",
  "konsep": "Geografi adalah ilmu yang mempelajari persamaan dan perbedaan fenomena geosfer dengan sudut pandang kelingkungan atau kewilayahan dalam konteks keruangan.",
  "studiKasus": "Kota Pekanbaru terletak di 0°32' LU dan 101°26' BT, merupakan pusat pertumbuhan ekonomi Provinsi Riau dengan karakteristik dataran rendah dan iklim tropis.",
  "order": 1,
  "createdAt": "2026-06-29T00:00:00Z",
  "updatedAt": "2026-06-29T00:00:00Z"
}
```

Tambahkan minimal 5 materi sesuai panduan PRD.

## ⚠️ PENTING: TESTING FLOW

1. Buat 1 akun admin manual di Firebase Console (role: 'admin')
2. Sign up sebagai user biasa
3. Test flow: Dashboard → Detail Materi → Kuis → Jurnal
4. Test admin: Login → Dashboard → Kelola Materi (CRUD)

## 📝 CATATAN IMPLEMENTASI

Karena keterbatasan context, saya sudah membuat:
- ✅ Firebase Service lengkap
- ✅ Detail Materi Screen
- ⚠️ Kuis Screen, Form Admin, dll perlu dibuat mengikuti pola yang sama

Ikuti pola yang sudah saya buat di firebaseService.ts untuk CRUD operations lainnya.

---
**Status: 40% Complete - Core infrastructure ready, screens need completion**
