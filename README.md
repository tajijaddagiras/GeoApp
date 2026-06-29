# Geo-Contextual App

**Media Pembelajaran Berbasis Android pada Mata Pelajaran Geografi di MAN 1 Pekanbaru**

## 📱 Deskripsi

Geo-Contextual App adalah aplikasi mobile pembelajaran Geografi yang mengintegrasikan pendekatan Contextual Teaching and Learning (CTL) untuk siswa MAN 1 Pekanbaru. Aplikasi ini menyajikan materi geografi yang dikaitkan dengan konteks lokal Riau dan Pekanbaru.

### Fitur Utama

**Untuk Pengguna (Siswa):**
- 🗺️ Peta Eksplorasi - Jalur pembelajaran interaktif dengan progress tracking
- 📖 Materi Kontekstual - Materi geografi dengan studi kasus lokal Riau/Pekanbaru
- 📍 Peta Interaktif - Visualisasi fenomena geografis
- 🌍 Zona Waktu Dunia - Pembelajaran garis lintang/bujur
- 📝 Kuis Evaluasi - Latihan soal dengan skor otomatis
- 📔 Jurnal Refleksi - Catatan perjalanan belajar dengan mood tracking
- 📊 Progres & Badge - Pencapaian dan statistik belajar

**Untuk Admin:**
- 📚 CRUD Materi - Kelola konten pembelajaran
- 📝 CRUD Soal Kuis - Kelola bank soal
- 👥 CRUD Pengguna - Kelola akun siswa
- 📊 Dashboard & Rekap - Monitor progres dan nilai seluruh siswa

## 🛠️ Teknologi

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **State Management**: Zustand
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Maps**: React Native Maps
- **Forms**: React Hook Form
- **Storage**: AsyncStorage

## 📋 Prasyarat

- Node.js (v16 atau lebih baru)
- npm atau yarn
- Expo CLI
- Android Studio (untuk emulator) atau perangkat Android fisik
- Akun Firebase (untuk backend)

## 🚀 Instalasi

1. Clone repository ini (file sudah di root folder):
```bash
# File sudah ada di folder ini, tidak perlu cd ke subfolder
npm install
```

2. Konfigurasi Firebase:
   - Buat project baru di [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, dan Storage
   - Copy Firebase config ke `src/config/firebase.ts`
   - **PENTING**: Deploy Firestore & Storage rules:
     ```bash
     # Install Firebase CLI
     npm install -g firebase-tools
     
     # Login
     firebase login
     
     # Init project
     firebase init
     
     # Deploy rules
     firebase deploy --only firestore:rules
     firebase deploy --only storage:rules
     ```
   - File `firestore.rules` dan `storage.rules` sudah siap pakai!

3. Konfigurasi Cloudinary (untuk upload gambar):
   - Buat akun di [Cloudinary](https://cloudinary.com/)
   - Buat Upload Preset (unsigned mode)
   - Copy credentials ke `.env`:
     ```bash
     cp .env.example .env
     # Edit .env dengan credentials Anda
     ```
   - Lihat **CLOUDINARY_SETUP.md** untuk panduan lengkap

4. Jalankan aplikasi:
```bash
# Development dengan Expo Go
npm start

# Build untuk Android
npm run android
```

## 📁 Struktur Folder

```
geo-contextual-app/
├── src/
│   ├── components/          # Komponen UI reusable
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── constants/          # Konstanta (colors, typography)
│   │   ├── colors.ts
│   │   └── typography.ts
│   ├── navigation/         # Konfigurasi navigasi
│   │   ├── AuthStack.tsx
│   │   ├── UserStack.tsx
│   │   ├── AdminStack.tsx
│   │   └── RootNavigator.tsx
│   ├── screens/           # Layar aplikasi
│   │   ├── auth/         # Autentikasi
│   │   ├── user/         # Layar pengguna
│   │   └── admin/        # Layar admin
│   ├── store/            # Zustand stores
│   │   ├── authStore.ts
│   │   └── progressStore.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── config/           # Konfigurasi
│       └── firebase.ts
├── App.tsx              # Entry point
├── app.json            # Expo configuration
├── package.json
└── README.md
```

## 🎨 Design System

### Palet Warna

- **Sage Teal** (#6AA88F) - Primary color
- **Deep Teal** (#4D8A72) - Primary variant
- **Warm Sand** (#FFF0A3) - Background
- **Earth Brown** (#5F481E) - Text primary
- **Mustard** (#CCAE66) - Accent

### Tipografi

- **Hero**: 32px, Bold
- **Title**: 22px, SemiBold
- **Heading**: 20px, SemiBold
- **Body**: 15px, Regular
- **Caption**: 12px, Regular

## 🔐 Autentikasi

Aplikasi mendukung 2 role berbeda:
- **User (Siswa)**: Akses fitur pembelajaran
- **Admin**: Akses panel CRUD dan monitoring

Login menggunakan email/NISN dan password.

## 📱 Fitur Offline

- Materi dapat diakses offline setelah diunduh
- Jurnal disimpan lokal dan disinkronkan saat online
- Progress tersimpan otomatis

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📦 Build Production

```bash
# Build APK
eas build --platform android --profile preview

# Build AAB (untuk Play Store)
eas build --platform android --profile production
```

## 📄 Lisensi

Project ini dibuat untuk keperluan penelitian dan pengembangan (skripsi).

## 👥 Tim Pengembang

- **Developer**: [Nama Anda]
- **Pembimbing**: [Nama Dosen Pembimbing]
- **Institusi**: MAN 1 Pekanbaru

## 📞 Kontak

Untuk pertanyaan atau saran, hubungi:
- Email: [email@example.com]
- Instagram: [@username]

---

**Catatan**: Aplikasi ini masih dalam tahap pengembangan (Development phase ADDIE).
