# Development Checklist

## 🔴 Priority 1: Core Functionality (CRITICAL)

### Firebase Integration
- [ ] Update firebase.ts dengan credentials asli
- [ ] Test Firebase connection
- [ ] Implement real authentication
  - [ ] Sign up with email
  - [ ] Sign in with email/password
  - [ ] Sign out
  - [ ] Check auth state persistence
- [ ] Create initial admin user di Firebase Console
- [ ] Test role-based navigation (admin vs user)

### User Screens - Complete CRUD
- [ ] **Kuis Screen**
  - [ ] Fetch soal dari Firestore
  - [ ] Render soal pilihan ganda
  - [ ] Timer countdown
  - [ ] Submit jawaban ke Firestore
  - [ ] Navigate to Hasil Kuis
- [ ] **Hasil Kuis Screen**
  - [ ] Show score
  - [ ] Show pembahasan per soal
  - [ ] Save score to Firestore
  - [ ] Update progress status
  - [ ] Button "Tulis Jurnal"
- [ ] **Tulis/Edit Jurnal Screen**
  - [ ] Form: judul, isi, mood selector
  - [ ] Image picker (optional)
  - [ ] Save to Firestore
  - [ ] Navigate back to list
- [ ] **Detail Jurnal Screen**
  - [ ] Show full jurnal content
  - [ ] Show image if exists
  - [ ] Edit button
  - [ ] Delete button with confirmation

### Admin Screens - Complete CRUD
- [ ] **Tambah/Edit Materi Form**
  - [ ] Form: title, KD, konsep, studi kasus
  - [ ] Image picker untuk cover
  - [ ] Upload image to Storage
  - [ ] Save/update to Firestore
  - [ ] Order management
- [ ] **Kelola Soal Screen**
  - [ ] List soal by materi
  - [ ] Search/filter
  - [ ] CRUD actions
- [ ] **Tambah/Edit Soal Form**
  - [ ] Form: pertanyaan, 4 pilihan, kunci jawaban
  - [ ] Pembahasan (optional)
  - [ ] Save to Firestore
- [ ] **Kelola Pengguna Screen**
  - [ ] List all users
  - [ ] Filter by class
  - [ ] Search by name/NISN
  - [ ] View detail
  - [ ] Edit user data
  - [ ] Delete/deactivate user
  - [ ] Generate kode aktivasi
- [ ] **Rekap Progres & Nilai**
  - [ ] Table view (user x topic x score)
  - [ ] Filter by class/topic
  - [ ] Export to CSV
  - [ ] Statistics summary

## 🟡 Priority 2: Enhancement Features

### Peta & Lokasi
- [ ] **Peta Interaktif Screen**
  - [ ] Integrate react-native-maps
  - [ ] Load map data dari Firestore
  - [ ] Show markers untuk fenomena geografis
  - [ ] Info card on marker tap
  - [ ] Link to related materi
- [ ] **Zona Waktu Dunia Screen**
  - [ ] List kota with current time
  - [ ] Show GMT offset
  - [ ] Add custom city
  - [ ] Explanation garis bujur

### Offline Mode
- [ ] Download materi untuk offline access
- [ ] Save progress locally with AsyncStorage
- [ ] Queue operations saat offline
- [ ] Sync when back online
- [ ] Show offline indicator

### Progress & Gamification
- [ ] Unlock next topic saat current completed
- [ ] Badge achievement system
- [ ] Streak tracking (belajar berturut-turut)
- [ ] Leaderboard (optional)

## 🟢 Priority 3: Polish & Testing

### UI/UX Improvements
- [ ] Loading states untuk semua async operations
- [ ] Error handling & user-friendly messages
- [ ] Empty states untuk semua lists
- [ ] Pull-to-refresh
- [ ] Skeleton loaders
- [ ] Toast notifications
- [ ] Haptic feedback

### Settings & Preferences
- [ ] User settings screen
  - [ ] Change password
  - [ ] Notification preferences
  - [ ] Font size adjustment
- [ ] Admin settings screen
  - [ ] App configuration
  - [ ] Data backup
  - [ ] System logs

### Testing
- [ ] Manual testing checklist
- [ ] Unit tests untuk stores
- [ ] Component tests
- [ ] Integration tests
- [ ] User acceptance testing (UAT) di MAN 1
- [ ] Bug fixes dari feedback

### Performance Optimization
- [ ] Image optimization (compress, lazy load)
- [ ] List virtualization (FlatList optimization)
- [ ] Reduce bundle size
- [ ] Cache strategies
- [ ] Memory leak checks

## 📱 Build & Deployment

### Pre-Production Checklist
- [ ] Update app version di app.json
- [ ] Update CHANGELOG.md
- [ ] Test di berbagai perangkat Android
- [ ] Test berbagai ukuran layar
- [ ] Check Android API level compatibility
- [ ] Security audit
  - [ ] Firebase security rules review
  - [ ] Sensitive data check
  - [ ] API keys secure

### Build APK
- [ ] Setup EAS Build
- [ ] Configure build profiles (preview, production)
- [ ] Build preview APK
- [ ] Internal testing (5-10 users)
- [ ] Fix critical bugs
- [ ] Build production APK

### Distribution
- [ ] Prepare for Play Store (jika publish)
  - [ ] App icon & screenshots
  - [ ] Store listing description
  - [ ] Privacy policy
  - [ ] Terms of service
- [ ] Alternative: Direct APK distribution
  - [ ] Upload to Google Drive/OneDrive
  - [ ] Share link to MAN 1 Pekanbaru
  - [ ] Installation guide document

## 📚 Documentation

### User Documentation
- [ ] User manual (siswa)
  - [ ] Cara install APK
  - [ ] Cara daftar & login
  - [ ] Panduan menggunakan fitur
  - [ ] FAQ
- [ ] Admin manual (guru/admin)
  - [ ] Cara login sebagai admin
  - [ ] Panduan CRUD materi
  - [ ] Panduan kelola pengguna
  - [ ] Panduan monitoring

### Research Documentation (Skripsi)
- [ ] Update bab metodologi
- [ ] Screenshot aplikasi untuk bab hasil
- [ ] Instrumen validasi ahli
  - [ ] Lembar validasi ahli media
  - [ ] Lembar validasi ahli materi
- [ ] Instrumen kepraktisan
  - [ ] Angket guru
  - [ ] Angket siswa
- [ ] Instrumen keefektifan
  - [ ] Soal pre-test
  - [ ] Soal post-test
- [ ] Template analisis data

## 🎯 Milestone Targets

### Milestone 1: MVP Complete (Target: 2 minggu)
- ✅ All Priority 1 tasks completed
- ✅ Firebase fully integrated
- ✅ Basic CRUD working
- ✅ Core user & admin flows functional

### Milestone 2: Feature Complete (Target: 4 minggu)
- ✅ All Priority 2 tasks completed
- ✅ Peta & offline mode working
- ✅ All screens implemented
- ✅ Ready for internal testing

### Milestone 3: Production Ready (Target: 6 minggu)
- ✅ All Priority 3 tasks completed
- ✅ Testing & bug fixes done
- ✅ APK built & tested
- ✅ Documentation complete
- ✅ Ready for field testing at MAN 1

### Milestone 4: Evaluation (Target: 8-10 minggu)
- ✅ Field testing completed
- ✅ Data collected
- ✅ Validation dari ahli
- ✅ Analysis done
- ✅ Thesis ready

## 📝 Notes

### Known Issues
- [ ] Tab bar icons (emoji) may not work on all Android versions → Consider react-native-vector-icons
- [ ] Firebase mock data needs to be replaced
- [ ] AsyncStorage sync mechanism not implemented yet

### Future Enhancements (Post-Skripsi)
- [ ] iOS support
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Video content support
- [ ] AR features untuk visualisasi 3D
- [ ] AI chatbot tutor

### Resources Needed
- [ ] Firebase account & setup
- [ ] Test devices (various Android versions)
- [ ] Content: materi Geografi lengkap
- [ ] Content: soal kuis per topik
- [ ] Content: images/illustrations
- [ ] Validator ahli media & materi
- [ ] Siswa untuk uji coba (1 kelas)

---

**How to Use This Checklist:**
1. Pilih task dari Priority 1
2. Mark as done dengan [x] saat selesai
3. Commit changes ke git untuk tracking
4. Review progress setiap minggu
5. Adjust timeline jika needed

**Last Updated**: 2026-06-29
