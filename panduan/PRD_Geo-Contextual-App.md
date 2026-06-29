# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Geo-Contextual App
**Media Pembelajaran Berbasis Android pada Mata Pelajaran Geografi di MAN 1 Pekanbaru**

| | |
|---|---|
| **Versi Dokumen** | 1.0 |
| **Status** | Draft untuk Penelitian & Pengembangan (Skripsi) |
| **Platform** | Android (React Native, mobile-first) |
| **Model Pengembangan** | ADDIE (Analysis, Design, Development, Implementation, Evaluation) |
| **Arsitektur Aplikasi** | 1 aplikasi React Native, 2 antarmuka berbasis role: **Admin** (panel CRUD) & **User/Pengguna** (siswa) |

> **Catatan asumsi:** Dokumen ini disusun dengan asumsi judul *"Geo-Contextual App"* merujuk pada media pembelajaran yang menerapkan pendekatan **Contextual Teaching and Learning (CTL)** pada mapel Geografi — yaitu mengaitkan materi geografi dengan konteks/lingkungan nyata siswa (Kota Pekanbaru & Provinsi Riau). Model pengembangan diasumsikan **ADDIE** karena paling umum dipakai untuk skripsi pengembangan media pembelajaran berbasis aplikasi; silakan beri tahu saya jika dosen pembimbing mensyaratkan model lain (Borg & Gall, 4D/Thiagarajan, dll) agar saya sesuaikan.
>
> **Revisi v1.1:** Stack teknis diubah ke **React Native**, dan role pengelola konten diubah dari "Guru" menjadi **Admin** generik dengan kewenangan CRUD penuh (Create, Read, Update, Delete) atas data materi, soal kuis, dan akun pengguna — terpisah dari halaman User/Pengguna, namun tetap dalam satu aplikasi (login menentukan tampilan).

---

## 1. Latar Belakang

Mata pelajaran Geografi bersifat abstrak sekaligus kontekstual: siswa perlu memahami fenomena keruangan (litosfer, hidrosfer, atmosfer, biosfer, antroposfer) yang sebagian besar dijelaskan melalui buku teks dan peta statis. Di MAN 1 Pekanbaru, pembelajaran Geografi masih dominan menggunakan metode ceramah dan media cetak, sehingga:

1. Siswa kesulitan menghubungkan konsep geografi dengan fenomena nyata di sekitar mereka (sungai, lahan gambut, iklim tropis Riau, dsb).
2. Keterbatasan media visual interaktif membuat materi sulit divisualisasikan (contoh: proses hidrologi, lapisan atmosfer, dinamika kependudukan).
3. Minat belajar menurun karena media pembelajaran kurang relevan dengan gaya belajar siswa generasi digital (mobile-first).
4. Belum ada media yang mengintegrasikan **prinsip kontekstual** (relating, experiencing, applying, cooperating, transferring) ke dalam satu aplikasi mobile yang dapat diakses kapan saja.

**Geo-Contextual App** dikembangkan untuk menjawab kebutuhan tersebut: aplikasi Android yang menyajikan materi Geografi secara kontekstual, visual, dan interaktif, lengkap dengan jurnal refleksi belajar, peta eksplorasi, dan evaluasi mandiri.

## 2. Rumusan Masalah

1. Bagaimana mengembangkan media pembelajaran *Geo-Contextual App* berbasis Android pada mata pelajaran Geografi di MAN 1 Pekanbaru?
2. Bagaimana tingkat **kevalidan** media menurut ahli media dan ahli materi?
3. Bagaimana tingkat **kepraktisan** media menurut respons guru dan siswa?
4. Bagaimana tingkat **keefektifan** media terhadap pemahaman konsep/hasil belajar siswa?

## 3. Tujuan Pengembangan

- Menghasilkan produk media pembelajaran berbasis Android bernama Geo-Contextual App pada mata pelajaran Geografi.
- Mengetahui kevalidan, kepraktisan, dan keefektifan produk melalui tahap evaluasi ADDIE.
- Menyediakan media yang mengintegrasikan pendekatan kontekstual (CTL) ke dalam pengalaman belajar mobile yang menarik dan reflektif.

## 4. Deskripsi Produk

Geo-Contextual App adalah aplikasi Android yang memposisikan siswa sebagai **"penjelajah" (explorer)** materi Geografi. Setiap topik/Kompetensi Dasar disajikan sebagai sebuah **"wilayah eksplorasi"** (mengadopsi tema peta perjalanan/maze dari referensi desain) yang harus dilalui siswa secara berurutan: membaca materi kontekstual → melihat studi kasus lokal Riau/Pekanbaru → mengerjakan kuis → menulis jurnal refleksi.

### Diferensiasi utama ("Geo-Contextual"):
- **Studi kasus lokal**: setiap materi nasional/global dikaitkan dengan contoh nyata di Pekanbaru/Riau (contoh: materi Hidrosfer dikaitkan dengan Sungai Siak; materi Antroposfer dikaitkan dengan dinamika penduduk Kota Pekanbaru).
- **Peta & lokasi**: fitur peta interaktif yang menunjukkan persebaran fenomena geografis secara visual.
- **Zona Waktu Dunia**: fitur dunia (terinspirasi referensi *world clock*) untuk mengajarkan materi garis lintang/bujur dan pembagian waktu (GMT).
- **Jurnal Refleksi Belajar**: siswa menuliskan refleksi setelah setiap topik (prinsip *reflecting* dalam CTL), terinspirasi dari fitur *mood diary* pada referensi desain.

## 5. Target Pengguna & Persona

| Persona | Peran | Kebutuhan Utama |
|---|---|---|
| **Siswa MAN 1 Pekanbaru** (kelas X/XI, 15–17 tahun) | **User/Pengguna** — Pemakai utama (Learner) | Materi ringkas-visual, gamifikasi progres, kuis cepat, jurnal pribadi |
| **Admin** (pengelola konten — dapat dioperasikan oleh guru Geografi/staf TU) | **Admin** — Pengelola sistem (CRUD) | Mengelola (tambah/lihat/ubah/hapus) materi, soal kuis, dan akun pengguna; memantau progres & nilai seluruh pengguna |
| **Ahli Media & Ahli Materi** (validator skripsi) | Validator eksternal | Akses lembar validasi (di luar aplikasi, via instrumen tertulis) |

## 6. Lingkup (Scope)

### In-Scope (Versi 1.0 / untuk penelitian)
**Halaman User/Pengguna:**
- Autentikasi pengguna (login/daftar sederhana, atau login dengan kode aktivasi yang dibuat Admin)
- Modul materi per topik sesuai KD Geografi kelas X/XI MAN
- Studi kasus kontekstual lokal (teks, gambar, peta) per topik
- Peta interaktif sederhana (titik lokasi fenomena geografis)
- Fitur Zona Waktu Dunia (edukasi garis bujur & waktu)
- Kuis evaluasi per topik (pilihan ganda + skor otomatis)
- Jurnal refleksi belajar (catatan + mood/emoji + riwayat per bulan)
- Peta progres belajar (visual jalur eksplorasi per topik, status terkunci/selesai)
- Profil pengguna & rekap progres
- Mode offline-first untuk akses materi (sinkron saat ada koneksi)

**Halaman Admin (Panel CRUD):**
- Login Admin terpisah (role-based, satu aplikasi React Native)
- **Create**: menambah materi/topik baru, soal kuis baru, akun pengguna baru, kode aktivasi kelas
- **Read**: melihat daftar seluruh materi, soal, pengguna, beserta rekap progres & nilai
- **Update**: mengedit materi, studi kasus kontekstual, soal kuis, dan data akun pengguna
- **Delete**: menghapus/menonaktifkan materi, soal, atau akun pengguna (dengan dialog konfirmasi)
- Dashboard ringkasan (jumlah pengguna aktif, rata-rata progres, rata-rata nilai kuis)

### Out-of-Scope (Versi 1.0)
- Live class / video conference
- Chat real-time antar pengguna
- Multi-platform iOS (fokus Android sesuai judul)
- Pembayaran/monetisasi
- AI chatbot tutor otomatis (dapat menjadi rekomendasi pengembangan lanjutan)

## 7. Model Pengembangan & Tahapan (ADDIE)

| Tahap | Aktivitas | Output |
|---|---|---|
| **Analysis** | Analisis kebutuhan pengguna (siswa) & Admin, analisis kurikulum/silabus Geografi MAN 1 Pekanbaru, analisis masalah pembelajaran existing | Laporan analisis kebutuhan |
| **Design** | Menyusun PRD, App Flow, storyboard, Design System, GBIM (Garis Besar Isi Media), naskah materi | Dokumen ini + App Flow.md + Design.md |
| **Development** | Pengembangan aplikasi React Native (UI User & Admin, database materi, fitur kuis/jurnal/peta, panel CRUD), pembuatan instrumen validasi | Aplikasi Android (APK) versi beta |
| **Implementation** | Uji coba terbatas pada siswa MAN 1 Pekanbaru (1 kelas) sebagai User, pelatihan singkat operator Admin | Data hasil uji coba & respons pengguna |
| **Evaluation** | Validasi ahli media & ahli materi, analisis kepraktisan (angket), analisis keefektifan (pre-test/post-test) | Laporan kevalidan, kepraktisan, keefektifan |

## 8. Kebutuhan Fungsional (Functional Requirements)

### 8.1 Autentikasi & Onboarding
- FR-01: Sistem menampilkan splash screen & onboarding singkat (pengantar konsep "menjelajah Geografi")
- FR-02: Pengguna dapat **Sign Up** menggunakan NISN/nama & kelas, atau kode aktivasi yang dibuat oleh Admin
- FR-03: Pengguna dapat **Sign In** dengan akun terdaftar
- FR-04: Sistem membedakan 2 role saat login — **Admin** diarahkan ke Panel Admin (CRUD), **User/Pengguna** diarahkan ke Dashboard Peta Eksplorasi

### 8.2 Peta Eksplorasi & Modul Materi
- FR-05: Dashboard menampilkan **Peta Eksplorasi** berisi topik-topik materi tersusun seperti jalur/maze yang terbuka secara progresif (topik berikutnya terkunci sampai topik sebelumnya selesai)
- FR-06: Setiap titik topik menampilkan: judul materi, KD terkait, estimasi waktu, status (belum/sedang/selesai)
- FR-07: Halaman materi menyajikan: penjelasan konsep, ilustrasi/infografis, **studi kasus kontekstual lokal Riau/Pekanbaru**, dan tautan ke peta interaktif jika relevan
- FR-08: Materi dapat diakses offline setelah diunduh sekali

### 8.3 Peta Interaktif & Zona Waktu Dunia
- FR-09: Fitur Peta Interaktif menampilkan titik-titik lokasi fenomena geografis (contoh: titik banjir, persebaran lahan gambut) dengan keterangan singkat saat ditekan
- FR-10: Fitur Zona Waktu Dunia menampilkan jam beberapa kota dunia (mengacu materi garis bujur/waktu), dengan opsi tambah kota
- FR-11: Fitur Timer/Stopwatch untuk sesi kuis bertimer dan pengingat jadwal belajar (alarm belajar)

### 8.4 Kuis & Evaluasi
- FR-12: Siswa dapat mengerjakan kuis pilihan ganda per topik dengan timer
- FR-13: Sistem menampilkan skor otomatis & pembahasan singkat setelah kuis selesai
- FR-14: Sistem mencatat riwayat skor untuk dipantau Admin

### 8.5 Jurnal Refleksi Belajar
- FR-15: Setelah menyelesaikan topik, siswa dapat menulis jurnal refleksi (judul/topik, isi catatan bebas, pilihan mood/ekspresi)
- FR-16: Riwayat jurnal ditampilkan dalam tampilan kalender/list, dikelompokkan per bulan & tahun (mengadopsi tampilan "My Diary" pada referensi)
- FR-17: Siswa dapat mengedit atau **menghapus** entri jurnal (dengan dialog konfirmasi hapus)
- FR-18: Siswa dapat menambahkan foto/lampiran sederhana pada jurnal (opsional)

### 8.6 Profil & Progres (Halaman User)
- FR-19: Halaman profil menampilkan progres keseluruhan (persentase topik selesai, badge pencapaian)
- FR-20: Progres & skor pengguna tersimpan dan dapat dipantau oleh Admin melalui Panel Admin

### 8.7 Panel Admin (CRUD) — Khusus Halaman Admin
- FR-21 **(Create)**: Admin dapat menambah topik/materi baru (judul, konsep, studi kasus kontekstual, gambar/peta)
- FR-22 **(Create)**: Admin dapat menambah soal kuis baru (pertanyaan, pilihan jawaban, kunci jawaban) per topik
- FR-23 **(Create)**: Admin dapat membuat akun pengguna baru atau kode aktivasi kelas
- FR-24 **(Read)**: Admin dapat melihat daftar seluruh materi, soal kuis, dan pengguna terdaftar dalam tabel/list
- FR-25 **(Read)**: Admin dapat melihat dashboard rekap: jumlah pengguna aktif, rata-rata progres, rata-rata nilai kuis per topik
- FR-26 **(Update)**: Admin dapat mengedit materi, studi kasus kontekstual, soal kuis, dan data akun pengguna yang sudah ada
- FR-27 **(Delete)**: Admin dapat menghapus topik/materi, soal kuis, atau menonaktifkan/menghapus akun pengguna — dengan dialog konfirmasi hapus (selaras pola UI "Delete item" pada referensi desain)
- FR-28: Setiap aksi Delete pada Panel Admin wajib menampilkan dialog konfirmasi sebelum data terhapus permanen
- FR-29: Admin **tidak** memiliki akses untuk membaca isi jurnal refleksi pribadi pengguna (hanya melihat data agregat/statistik), untuk menjaga privasi siswa

## 9. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|---|---|
| **Platform** | Android minimal API 24 (Android 7.0) ke atas |
| **Performa** | Waktu muat layar < 2 detik pada perangkat kelas menengah |
| **Ketersediaan offline** | Materi & jurnal dapat diakses tanpa koneksi internet; sinkronisasi otomatis saat online |
| **Keamanan data** | Data pengguna (jurnal, skor) tersimpan aman, tidak dapat diakses pengguna lain; akses Panel Admin dilindungi autentikasi role-based |
| **Usability** | Navigasi maksimal 3 tap untuk mencapai fitur utama; bahasa UI sesuai usia siswa SMA/MA; Panel Admin dirancang sederhana (form CRUD jelas) walau dioperasikan dari mobile |
| **Skalabilitas** | Struktur konten materi, soal kuis, dan data pengguna mudah ditambah/diubah/dihapus oleh Admin melalui Panel CRUD tanpa perlu update aplikasi (backend cloud) |
| **Aksesibilitas** | Kontras warna memadai (WCAG AA), ukuran teks dapat diskalakan |

## 10. Spesifikasi Teknis (Rekomendasi)

| Komponen | Rekomendasi | Alternatif |
|---|---|---|
| Framework Mobile | **React Native** (dengan Expo, untuk kecepatan development & kemudahan build APK) | React Native CLI (bare workflow) bila butuh native module khusus |
| Bahasa | JavaScript / **TypeScript** (disarankan untuk struktur data CRUD yang lebih aman) | JavaScript murni |
| Navigasi | **React Navigation** — Stack terpisah per role: `AdminStack` & `UserStack`, dipilih otomatis setelah login sesuai field `role` pada akun | Expo Router |
| State Management | **Redux Toolkit** atau **Zustand** (untuk state progres, sesi kuis, role pengguna) | React Context API (untuk skala kecil) |
| Backend & Database | **Firebase** (Authentication dengan custom claim `role: admin/user`, Firestore untuk data materi/soal/pengguna/jurnal, Storage untuk gambar) | Node.js + Express + REST API + PostgreSQL/MongoDB |
| Operasi CRUD Admin | Firestore CRUD langsung (collection: `materi`, `soal`, `users`, `progres`) via SDK Firebase di `AdminStack` | REST API dengan endpoint `/materi`, `/soal`, `/users` (CRUD standar) |
| Peta Interaktif | `react-native-maps` (Google Maps provider) | Mapbox React Native SDK |
| Penyimpanan offline | `AsyncStorage` + sinkronisasi Firestore, atau `WatermelonDB` untuk dataset lebih besar | `expo-sqlite` |
| Form & Validasi (Panel Admin) | `react-hook-form` + `yup`/`zod` untuk validasi form Create/Update | Formik |
| Desain & Prototyping | Figma (mengacu Design.md) | Adobe XD |
| Build & Distribusi | EAS Build (Expo Application Services) → APK untuk uji coba terbatas | Android Studio (build manual via React Native CLI) |

> Karena judul menegaskan **"Berbasis Android"**, build diarahkan ke APK Android. React Native tetap memungkinkan ekspansi ke iOS di masa depan tanpa menulis ulang aplikasi, bila dibutuhkan di luar lingkup skripsi ini.

### 10.1 Catatan Arsitektur Role Admin vs User

- **Satu aplikasi React Native**, satu basis kode (codebase) — bukan dua aplikasi terpisah.
- Saat login, sistem membaca field `role` pada dokumen pengguna di Firestore/database.
- `role === "admin"` → diarahkan ke **AdminStack** (Dashboard Admin, Kelola Materi, Kelola Soal, Kelola Pengguna, Rekap Progres).
- `role === "user"` → diarahkan ke **UserStack** (Peta Eksplorasi, Materi, Kuis, Jurnal, Profil).
- Disarankan menambahkan **Route Guard** sederhana (cek role di setiap stack) agar User tidak bisa mengakses layar Admin meski mencoba deep-link manual.

## 11. Struktur Konten Materi Geografi (Contoh Pemetaan)

> Sesuaikan dengan silabus/Capaian Pembelajaran aktual yang digunakan di MAN 1 Pekanbaru (Kurikulum Merdeka/K13). Berikut contoh pemetaan topik ke fitur kontekstual:

| Topik Geografi (Kelas X) | Studi Kasus Kontekstual Riau/Pekanbaru | Fitur Terkait |
|---|---|---|
| Pengetahuan Dasar Geografi & Peta | Peta wilayah administratif Kota Pekanbaru | Peta Interaktif |
| Dinamika Litosfer | Karakteristik tanah gambut Riau | Modul Materi |
| Dinamika Atmosfer | Iklim tropis & kualitas udara (kabut asap) Riau | Modul Materi + Peta |
| Dinamika Hidrosfer | Sungai Siak & DAS sekitarnya | Peta Interaktif |
| Garis Lintang/Bujur & Waktu | Posisi astronomis Pekanbaru (zona WIB) | Zona Waktu Dunia |

| Topik Geografi (Kelas XI) | Studi Kasus Kontekstual Riau/Pekanbaru | Fitur Terkait |
|---|---|---|
| Dinamika Kependudukan | Pertumbuhan & migrasi penduduk Kota Pekanbaru | Modul Materi |
| Mitigasi Bencana | Bencana kebakaran lahan & banjir Riau | Modul Materi + Peta |
| Ketahanan Pangan/Industri/Energi | Industri kelapa sawit & migas Riau | Modul Materi |

## 12. Rencana Evaluasi (Instrumen Penelitian)

| Jenis Uji | Instrumen | Subjek | Indikator Keberhasilan |
|---|---|---|---|
| **Kevalidan** | Lembar validasi ahli media (skala Likert 1–4) | Dosen/ahli media pembelajaran | Rata-rata skor ≥ 3,4 (kategori "Sangat Valid"/"Valid") |
| **Kevalidan** | Lembar validasi ahli materi | Guru/dosen Geografi | Rata-rata skor ≥ 3,4 |
| **Kepraktisan** | Angket respons guru (sebagai operator Admin) | 1–2 guru Geografi MAN 1 Pekanbaru | Persentase respons positif ≥ 80% |
| **Kepraktisan** | Angket respons siswa (sebagai User/Pengguna) | Siswa uji coba (1 kelas) | Persentase respons positif ≥ 80% |
| **Keefektifan** | Pre-test & Post-test pemahaman konsep | Siswa uji coba | N-Gain kategori "sedang/tinggi" atau peningkatan rata-rata nilai signifikan |

## 13. Metrik Keberhasilan Produk (selain metrik penelitian)

- Tingkat penyelesaian modul (completion rate) per siswa ≥ 70%
- Rata-rata jumlah entri jurnal refleksi per siswa selama uji coba ≥ 1 entri/topik
- Waktu rata-rata pengerjaan kuis sesuai estimasi (tidak under/over 50% dari waktu yang ditentukan)
- Tidak ada crash kritis selama periode uji coba terbatas

## 14. Timeline Pengembangan (Estimasi)

| Fase | Durasi Estimasi |
|---|---|
| Analysis (analisis kebutuhan & kurikulum) | 2–3 minggu |
| Design (PRD, App Flow, Design System, storyboard, naskah materi) | 3–4 minggu |
| Development (build aplikasi + konten) | 6–8 minggu |
| Implementation (uji coba terbatas di MAN 1 Pekanbaru) | 2–3 minggu |
| Evaluation (validasi ahli, analisis data, revisi) | 2–3 minggu |
| Penyusunan laporan & sidang skripsi | 3–4 minggu |

## 15. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Akses internet terbatas di lingkungan sekolah | Mode offline-first untuk materi inti |
| Perangkat siswa beragam (low-end device) | Optimasi aset gambar, hindari animasi berat |
| Waktu pengembangan terbatas (skripsi) | Prioritaskan fitur inti halaman User (FR-01 s/d FR-20) dan modul Admin esensial (FR-21, FR-24, FR-26, FR-27); fitur peta/lokasi GPS real-time dapat disederhanakan menjadi peta statis interaktif jika waktu terbatas |
| Validitas konten geografi | Libatkan guru Geografi MAN 1 Pekanbaru sejak tahap Analysis & Design (sebagai operator Admin sekaligus ahli materi) |

## 16. Lampiran: Daftar Layar Aplikasi (ringkas)

Lihat detail lengkap pada **App-Flow_Geo-Contextual-App.md**. Ringkasan layar utama:

**Halaman User/Pengguna:**
1. Splash & Onboarding
2. Sign In / Sign Up
3. Dashboard — Peta Eksplorasi (jalur topik)
4. Detail Materi & Studi Kasus Kontekstual
5. Peta Interaktif
6. Zona Waktu Dunia
7. Kuis & Hasil Kuis
8. Tulis Jurnal Refleksi
9. Riwayat Jurnal (kalender/list per bulan)
10. Hapus Entri Jurnal (konfirmasi)
11. Profil & Progres Pengguna

**Halaman Admin (Panel CRUD):**
12. Dashboard Admin (ringkasan statistik)
13. Kelola Materi — List, Tambah, Edit, Hapus
14. Kelola Soal Kuis — List, Tambah, Edit, Hapus
15. Kelola Pengguna — List, Tambah, Edit, Nonaktifkan/Hapus
16. Rekap Progres & Nilai seluruh Pengguna

---
*Dokumen ini merupakan bagian dari tahap Design pada model ADDIE dan menjadi acuan pengembangan pada tahap Development.*
