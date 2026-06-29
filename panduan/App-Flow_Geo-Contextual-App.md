# APP FLOW DOCUMENT
## Geo-Contextual App — Alur Aplikasi & Information Architecture

> Dokumen ini melengkapi PRD_Geo-Contextual-App.md. Diagram menggunakan format **Mermaid** — dapat dirender langsung di Obsidian, GitHub, VS Code (extension Mermaid), atau di mermaid.live bila viewer Anda belum mendukung mermaid secara native.

---

## 1. Sitemap / Information Architecture

```mermaid
flowchart TD
    A[Splash Screen] --> B{Sudah Login?}
    B -->|Belum| C[Onboarding]
    C --> D[Sign In / Sign Up]
    B -->|Sudah| R{Cek Role}
    D --> R

    R -->|role: user| E[UserStack: Dashboard Peta Eksplorasi]
    R -->|role: admin| S[AdminStack: Dashboard Admin]

    E --> F[Detail Materi & Studi Kasus Kontekstual]
    E --> G[Peta Interaktif]
    E --> H[Zona Waktu Dunia]
    E --> I[Riwayat Jurnal]
    E --> J[Profil & Progres]

    F --> K[Kuis Topik]
    K --> L[Hasil Kuis]
    L --> M[Tulis Jurnal Refleksi]
    M --> I

    I --> N[Detail Jurnal]
    N --> O[Edit Jurnal]
    N --> P[Hapus Jurnal - Konfirmasi]

    J --> Q[Pengaturan Akun]
    J --> Q2[Lencana / Badge Pencapaian]

    S --> T[Kelola Materi - CRUD]
    S --> U[Kelola Soal Kuis - CRUD]
    S --> V[Kelola Pengguna - CRUD]
    S --> W[Rekap Progres & Nilai Pengguna]
```

> **Catatan arsitektur:** `UserStack` dan `AdminStack` berada dalam **satu aplikasi React Native** yang sama. Setelah Sign In berhasil, sistem membaca field `role` pada akun untuk menentukan stack navigasi mana yang ditampilkan (lihat PRD bagian 10.1).

---

## 2. Flow Detail: Onboarding & Autentikasi

**Tujuan:** Memperkenalkan konsep "menjelajah Geografi" dan memastikan siswa masuk dengan identitas yang terhubung ke kelasnya.

```mermaid
flowchart TD
    A[Buka App] --> B[Splash Screen Logo]
    B --> C[Onboarding 1: Ilustrasi peta & kompas]
    C --> D[Onboarding 2: Penjelasan konsep eksplorasi materi]
    D --> E{Pilih Aksi}
    E -->|Sign Up| F[Form: Nama, NISN, Kelas, Kode Aktivasi dari Admin]
    F --> G[Verifikasi Kode Aktivasi]
    G -->|Valid| H[Akun Dibuat, role: user] --> J{Cek Role}
    G -->|Tidak Valid| F
    E -->|Sign In| I[Form: NISN/Email + Password]
    I -->|Valid| J
    I -->|Tidak Valid| K[Tampilkan Error] --> I
    J -->|role: user| L[UserStack: Dashboard]
    J -->|role: admin| M[AdminStack: Dashboard Admin]
```

**Referensi layar (dari desain acuan):** layar "Sign In / Sign Up" dengan tombol outline mustard di atas latar ilustrasi gurun → diadaptasi menjadi ilustrasi **peta dunia/kompas geografi** dengan palet teal-sand yang sama. Form Sign Up sama untuk User; Admin dibuatkan akunnya langsung melalui database/seed awal (tidak ada Sign Up publik untuk role Admin, demi keamanan).

---

## 3. Flow Detail: Dashboard "Peta Eksplorasi" (Learning Path)

**Tujuan:** Menggantikan daftar materi konvensional dengan **jalur eksplorasi visual** (mengadopsi pola "maze/path map" pada referensi), memberi gamifikasi progres belajar per minggu/topik.

```mermaid
flowchart TD
    A[Dashboard Peta Eksplorasi] --> B{Topik Terkunci?}
    B -->|Ya - belum selesai prasyarat| C[Tampilkan ikon gembok + tooltip prasyarat]
    B -->|Tidak| D[Tap Titik Topik]
    D --> E[Halaman Detail Materi]
    E --> F[Baca Konsep Umum]
    F --> G[Lihat Studi Kasus Kontekstual Riau/Pekanbaru]
    G --> H[Lihat Infografis/Peta jika ada]
    H --> I{Lanjut ke Kuis?}
    I -->|Ya| J[Mulai Kuis Topik]
    I -->|Belum, tandai dibaca dulu| E
    J --> K[Hasil Kuis + Pembahasan]
    K --> L[Topik berikutnya terbuka otomatis]
    K --> M[Prompt: Tulis Jurnal Refleksi]
```

**Status visual tiap titik topik:** `Terkunci` (abu-abu) → `Tersedia` (mustard outline) → `Sedang Dikerjakan` (teal terisi sebagian) → `Selesai` (teal penuh + centang/bintang), meniru indikator "1 Day", checkpoint bendera, dan ikon hewan/landmark pada jalur referensi.

---

## 4. Flow Detail: Peta Interaktif & Zona Waktu Dunia

```mermaid
flowchart TD
    A[Dashboard] --> B[Buka Peta Interaktif]
    B --> C[Tampilkan peta wilayah Riau/Pekanbaru]
    C --> D[Tap titik fenomena geografis]
    D --> E[Card info: nama lokasi, jenis fenomena, keterkaitan materi]
    E --> F[Tombol: Buka Materi Terkait]

    A --> G[Buka Zona Waktu Dunia]
    G --> H[List kota & jam real-time]
    H --> I[Tambah Kota Baru]
    H --> J[Tap kota -> penjelasan garis bujur & selisih waktu terhadap WIB]
```

**Referensi layar:** menggantikan layar *"Clock / World Time (Beijing, Guatemala, Hong Kong)"* pada desain acuan — fungsinya dipertahankan namun konten diarahkan ke pembelajaran **garis bujur dan pembagian zona waktu**.

---

## 5. Flow Detail: Kuis & Evaluasi

```mermaid
flowchart TD
    A[Mulai Kuis] --> B[Tampilkan Timer/Stopwatch berjalan]
    B --> C[Soal Pilihan Ganda 1..n]
    C --> D{Semua soal terjawab?}
    D -->|Belum & waktu habis| E[Submit otomatis]
    D -->|Ya| F[Tombol Submit]
    E --> G[Halaman Hasil: Skor + Pembahasan]
    F --> G
    G --> H[Skor tersimpan ke profil & Panel Admin]
    G --> I[Lanjut: Tulis Jurnal Refleksi]
```

---

## 6. Flow Detail: Jurnal Refleksi Belajar ("My Diary")

**Tujuan:** Mengadaptasi langsung fitur *Mood Diary* pada referensi — siswa merefleksikan pengalaman belajarnya (prinsip *reflecting* dalam Contextual Teaching and Learning).

```mermaid
flowchart TD
    A[Selesai Topik/Kuis] --> B[Prompt: Tulis Jurnal?]
    B -->|Ya| C[Form Jurnal: Judul Topik]
    C --> D[Input catatan bebas: 'Bagaimana belajarmu hari ini?']
    D --> E[Pilih mood/ekspresi - emoji]
    E --> F[Opsional: tambah foto]
    F --> G[Simpan]
    G --> H[Masuk ke Riwayat Jurnal]

    H --> I[Tampilan kalender per bulan & tahun]
    I --> J[List entri jurnal bulan terpilih]
    J --> K[Tap entri -> Detail Jurnal]
    K --> L[Edit]
    K --> M[Hapus]
    M --> N[Dialog Konfirmasi Hapus]
    N -->|Ya, Hapus| O[Entri terhapus, kembali ke list]
    N -->|Batal| K
```

**Referensi layar yang diadaptasi 1:1:**
- *"My diary"* (list per bulan, tab tahun 2020–2024+) → **Riwayat Jurnal**, tab diganti per **semester/bulan tahun ajaran**.
- *"Enter the topic / How is today?"* (form catatan kosong dengan ilustrasi) → **Form Jurnal Refleksi**.
- *"Delete item"* (list dengan checkmark hijau, tombol silang merah) → **Konfirmasi Hapus Jurnal**, gaya & komponen dipertahankan sama.

---

## 7. Flow Detail: Profil & Progres (Halaman User)

```mermaid
flowchart TD
    A[Profil Pengguna] --> B[Lihat persentase topik selesai]
    A --> C[Lihat lencana/badge pencapaian]
    A --> D[Riwayat skor kuis per topik]
    A --> E[Pengaturan akun]
```

---

## 8. Flow Detail: Panel Admin (CRUD)

**Tujuan:** Memberi Admin kendali penuh atas konten & data pengguna, terpisah dari pengalaman belajar User, dalam satu aplikasi React Native yang sama (akses via `AdminStack`).

### 8.1 Dashboard Admin

```mermaid
flowchart TD
    A[Login sebagai Admin] --> B[Dashboard Admin]
    B --> C[Statistik ringkas: total pengguna aktif, rata-rata progres, rata-rata nilai kuis]
    B --> D[Menu: Kelola Materi]
    B --> E[Menu: Kelola Soal Kuis]
    B --> F[Menu: Kelola Pengguna]
    B --> G[Menu: Rekap Progres & Nilai]
```

### 8.2 CRUD Kelola Materi

```mermaid
flowchart TD
    A[Kelola Materi] --> B[List seluruh topik/materi - READ]
    B --> C[Tombol + Tambah Materi]
    C --> D[Form CREATE: judul, KD, konsep, studi kasus kontekstual, gambar/peta]
    D --> E[Simpan] --> B

    B --> F[Tap salah satu materi]
    F --> G[Detail Materi]
    G --> H[Tombol Edit - UPDATE]
    H --> I[Form terisi data lama, ubah field] --> J[Simpan Perubahan] --> B
    G --> K[Tombol Hapus - DELETE]
    K --> L[Dialog Konfirmasi Hapus]
    L -->|Ya, Hapus| M[Materi terhapus] --> B
    L -->|Batal| G
```

### 8.3 CRUD Kelola Soal Kuis

```mermaid
flowchart TD
    A[Kelola Soal Kuis] --> B[Pilih Materi/Topik terkait]
    B --> C[List soal pada topik tersebut - READ]
    C --> D[Tombol + Tambah Soal]
    D --> E[Form CREATE: pertanyaan, 4 pilihan jawaban, kunci jawaban]
    E --> F[Simpan] --> C

    C --> G[Tap salah satu soal]
    G --> H[Tombol Edit - UPDATE] --> I[Ubah pertanyaan/pilihan/kunci] --> C
    G --> J[Tombol Hapus - DELETE]
    J --> K[Dialog Konfirmasi Hapus]
    K -->|Ya, Hapus| L[Soal terhapus] --> C
    K -->|Batal| G
```

### 8.4 CRUD Kelola Pengguna

```mermaid
flowchart TD
    A[Kelola Pengguna] --> B[List seluruh akun pengguna - READ]
    B --> C[Filter/cari berdasarkan nama/kelas]
    B --> D[Tombol + Tambah Pengguna / Generate Kode Aktivasi]
    D --> E[Form CREATE: nama, NISN, kelas]
    E --> F[Simpan] --> B

    B --> G[Tap salah satu pengguna]
    G --> H[Detail Akun: data diri + progres + skor]
    H --> I[Tombol Edit - UPDATE]
    I --> J[Ubah data: nama, kelas, reset password] --> B
    H --> K[Tombol Nonaktifkan/Hapus Akun - DELETE]
    K --> L[Dialog Konfirmasi Hapus]
    L -->|Ya, Hapus| M[Akun dihapus/nonaktif] --> B
    L -->|Batal| H
```

> **Privasi:** Detail Akun pada Admin **tidak menampilkan isi jurnal refleksi pribadi** pengguna — hanya data progres & skor kuis (agregat), sesuai FR-29 pada PRD.

### 8.5 Rekap Progres & Nilai

```mermaid
flowchart TD
    A[Rekap Progres & Nilai] --> B[Tabel: Pengguna x Topik x Status x Skor]
    B --> C[Filter per kelas/topik]
    B --> D[Export/lihat ringkasan untuk kebutuhan laporan guru]
```

**Catatan desain Panel Admin:** komponen visual (kartu list, tombol, dialog konfirmasi hapus) tetap mengikuti Design System yang sama dengan halaman User (lihat Design.md) — hanya struktur layar yang lebih berorientasi tabel/form data, mengingat ini adalah panel pengelolaan, bukan pengalaman eksplorasi.

---

## 9. Ringkasan Navigasi Utama (Bottom Navigation Bar)

### 9.1 Bottom Nav — Halaman User

Mengacu pola bottom-nav 5 ikon pada referensi (chat/jurnal, dokumen, peta/kamera, lokasi, profil), disesuaikan menjadi:

| Posisi | Ikon | Tujuan |
|---|---|---|
| 1 | 🗺️ Peta Eksplorasi | Dashboard utama / learning path |
| 2 | 📖 Materi | Daftar semua modul (akses cepat tanpa harus lewat jalur) |
| 3 | 📍 Peta Interaktif | Peta fenomena geografis kontekstual |
| 4 | 📔 Jurnal | Riwayat jurnal refleksi |
| 5 | 👤 Profil | Progres, badge, pengaturan |

Tombol **(+)** mengambang (floating action button) di layar Jurnal untuk menambah entri baru — dipertahankan persis seperti pada referensi.

### 9.2 Bottom Nav — Halaman Admin

| Posisi | Ikon | Tujuan |
|---|---|---|
| 1 | 📊 Dashboard | Statistik ringkas |
| 2 | 📚 Materi | Kelola Materi (CRUD) |
| 3 | 📝 Soal | Kelola Soal Kuis (CRUD) |
| 4 | 👥 Pengguna | Kelola Pengguna (CRUD) |
| 5 | ⚙️ Akun | Profil Admin & logout |

Tombol **(+)** mengambang juga dipertahankan pada layar Kelola Materi/Soal/Pengguna sebagai aksi cepat **Create**, konsisten dengan pola FAB di halaman User.

---

## 10. Aturan Navigasi & State Penting

- **Maksimal 3 tap** dari Dashboard ke fitur manapun, baik di UserStack maupun AdminStack.
- Topik terkunci tidak dapat ditekan untuk masuk ke materi (hanya menampilkan tooltip prasyarat).
- Jurnal yang sudah dihapus **tidak dapat di-undo** dari sisi UI — karena itu konfirmasi hapus wajib ditampilkan (selaras referensi layar "Delete item"). Aturan ini berlaku juga untuk semua aksi Delete di Panel Admin (materi, soal, pengguna).
- Mode offline (UserStack): ikon indikator kecil di header saat tidak ada koneksi; entri jurnal & progres kuis disimpan lokal lalu disinkronkan otomatis saat online kembali.
- **Role Admin tidak memiliki akses** untuk membaca isi jurnal refleksi pribadi pengguna (hanya data agregat/statistik progres & nilai), untuk menjaga privasi siswa.
- **Route Guard:** User tidak dapat mengakses layar AdminStack meski mencoba deep-link manual; sebaliknya Admin tidak memiliki akun Sign Up publik.

---

*Lihat Design_Geo-Contextual-App.md untuk spesifikasi visual (warna, tipografi, komponen) dari setiap layar di atas.*
