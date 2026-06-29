# DESIGN SYSTEM
## Geo-Contextual App — Design.md

> Palet warna pada dokumen ini diekstrak langsung dari gambar referensi yang Anda berikan (tema "Mood Diary" gaya gurun/explorer), kemudian diadaptasi ke konteks **eksplorasi Geografi**.

---

## 1. Konsep & Mood Visual

**Tone:** Hangat, ramah, "petualangan belajar" — bukan kelas formal, melainkan jurnal eksplorasi pribadi siswa.

**Tema visual:** Pada referensi, siswa "menjelajahi gurun" dengan teropong & peta. Untuk Geo-Contextual App, konsep ini diperluas menjadi **"menjelajahi bumi"** — setiap topik Geografi direpresentasikan sebagai bioma/wilayah berbeda yang konsisten dengan materi:

| Topik Geografi | Ilustrasi Wilayah (analog tema gurun pada referensi) |
|---|---|
| Litosfer | Pegunungan & lapisan tanah |
| Hidrosfer | Sungai, danau, garis pantai |
| Atmosfer | Langit, awan, gradasi senja-pagi |
| Biosfer | Hutan tropis |
| Antroposfer | Siluet kota/pemukiman |

Ilustrasi tetap menggunakan **gaya flat/semi-flat dengan outline lembut**, sama seperti karakter unta, kaktus, dan tengkorak pada referensi — diganti elemen khas Riau (pohon sawit, rumah panggung, sungai, dsb) agar tetap kontekstual.

---

## 2. Palet Warna

### 2.1 Warna Primer (diekstrak dari referensi)

| Nama | Hex | Penggunaan |
|---|---|---|
| **Sage Teal** (primer) | `#6AA88F` | Background gradasi langit, header bar, elemen navigasi aktif |
| **Deep Teal** | `#4D8A72` | Variasi gelap untuk teks di atas background terang / tombol primer alternatif |
| **Warm Sand** | `#FFF0A3` | Background kartu, area konten utama (menggantikan putih polos) |
| **Earth Brown** | `#5F481E` | Teks utama, ikon gelap, elemen tanah/ground |
| **Tan / Mustard** | `#CCAE66` | Tombol outline (Sign In/Up), border kartu, elemen interaktif sekunder |

### 2.2 Warna Aksen (status & kategori)

| Nama | Hex (indikatif) | Penggunaan |
|---|---|---|
| **Coral / Terracotta** | `#E0744A` | Ikon mood "kesulitan/sedih", notifikasi, badge kategori 1 |
| **Soft Blue** | `#4FA0C9` | Ikon mood "netral/tenang", badge kategori 2, elemen air (Hidrosfer) |
| **Leaf Green** | `#7CAE6B` | Status "selesai", topik biosfer |
| **Alert Red** | `#D9534F` | Tombol/ikon hapus (mengacu tombol silang merah pada layar "Delete item") |
| **Success Green Check** | `#3FA66B` | Centang konfirmasi (mengacu ikon centang hijau pada layar "Delete item") |

### 2.3 Neutral

| Nama | Hex | Penggunaan |
|---|---|---|
| Cream White | `#FFF8E7` | Background alternatif untuk mode terang/kontras tinggi |
| Charcoal Text | `#332A1C` | Teks sekunder/body text di atas kartu krem |
| Border Subtle | `#E3D6A8` | Garis pembatas antar item list |

> **Catatan:** kode warna aksen (coral/biru/hijau) bersifat **indikatif** — diperkirakan secara visual dari referensi karena badge berukuran kecil; disarankan dilakukan color-pick ulang di Figma saat aset asli (vektor) tersedia untuk presisi maksimal.

---

## 3. Tipografi

Mengikuti gaya referensi: judul besar bold rounded (lihat "MOOD DIARY", "My diary", jam digital besar "15:11:20") dipasangkan dengan body text yang ringan.

| Elemen | Rekomendasi Font | Ukuran (mobile) | Weight |
|---|---|---|---|
| Logo / Judul Hero (cth. "GEO EXPLORER") | Baloo 2 / Fredoka (rounded, playful) | 28–32px | Bold/700 |
| Heading layar (cth. "Peta Eksplorasi") | Poppins | 20–22px | SemiBold/600 |
| Subheading / label tab bulan | Poppins | 14px | Medium/500 |
| Body text materi & jurnal | Inter / Nunito Sans | 14–15px | Regular/400 |
| Caption (waktu, tanggal, metadata) | Inter | 11–12px | Regular/400, opacity 70% |

---

## 4. Komponen UI (Component Library)

### 4.1 Kartu Item List (Riwayat Jurnal / Materi)
- Background: `Warm Sand (#FFF0A3)` dengan radius besar (16–20px), shadow lembut.
- Ikon bulat berwarna (badge mood/kategori) di kiri, diameter ±40px.
- Judul + subtitle (tanggal/waktu) di tengah, ikon love/bookmark di kanan.
- **Referensi langsung:** layar "My diary" — struktur dipertahankan 1:1.

### 4.2 Tombol
- **Primary (filled):** Deep Teal bg, teks Cream White, radius pill (full rounded).
- **Secondary (outline):** Mustard border 2px, teks Earth Brown, bg transparan — mengacu tombol "SIGN IN" / "SIGN UP" pada referensi.
- **Destructive:** Alert Red, hanya untuk aksi hapus.

### 4.3 Floating Action Button (+)
- Bulat penuh, Earth Brown bg, ikon (+) Cream White, posisi bottom-right di atas bottom nav — identik referensi (layar Jurnal & Diary).

### 4.4 Tab Filter (Bulan/Tahun)
- Pill-shaped tabs horizontal scroll, tab aktif berwarna Mustard solid + teks gelap, tab non-aktif outline transparan.
- **Referensi langsung:** tab bulan "January–May" & tab tahun "2020–2024" pada layar "My diary".

### 4.5 Bottom Navigation Bar
- Background Earth Brown gelap (kontras dengan konten), 5 ikon line-style Cream White, ikon aktif diberi background pill Mustard.

### 4.6 Toggle Switch (Pengingat/Jadwal Belajar)
- Mengacu layar "Alarm clock" pada referensi: pill switch, state ON = Mustard solid, state OFF = abu-abu netral.

### 4.7 Peta Jalur Eksplorasi (Learning Path)
- Garis jalur putus-putus/menyambung gaya hand-drawn map di atas background ilustrasi bioma.
- Checkpoint berbentuk lingkaran dengan ikon status (gembok = terkunci, bendera = checkpoint, bintang = selesai).
- Label minggu/sesi (kotak kayu kecil, mengacu badge "1 week" pada referensi).

### 4.8 Dialog Konfirmasi Hapus
- Header "Hapus Entri?" dengan ikon silang merah bulat.
- List item yang akan dihapus ditampilkan dengan centang hijau di sisi kanan (mengacu layar "Delete item" pada referensi) sebagai indikator item terpilih.
- Dua tombol: "Batal" (outline) dan "Hapus" (filled Alert Red).

### 4.9 Form Input (Jurnal/Catatan)
- Card besar Cream White dengan placeholder ilustrasi kecil di pojok atas (mengacu ikon tanda tanya pada layar "Enter the topic").
- Label placeholder: *"Bagaimana belajarmu hari ini?"* sebagai pengganti *"How is today?"*.
- Tombol "Batal" & "Simpan" sejajar di bawah, gaya sama seperti "Cancel"/"Save" pada referensi.

---

## 5. Pemetaan Layar Referensi → Layar Geo-Contextual App

| # | Layar Referensi (gambar Anda) | Adaptasi di Geo-Contextual App |
|---|---|---|
| 1 | Splash gurun + teropong | Splash peta dunia/kompas + ilustrasi bioma |
| 2 | "MOOD DIARY" + Sign In/Sign Up | "GEO EXPLORER" (nama brand internal) + Sign In/Sign Up |
| 3 | "My diary" list per bulan/tahun | Riwayat Jurnal Refleksi per bulan/semester |
| 4 | Peta jalur/maze "1 week" | Peta Eksplorasi topik per Kompetensi Dasar |
| 5 | Jam dunia (Beijing/Guatemala/Hong Kong) | Zona Waktu Dunia (materi garis bujur) |
| 6 | Form "Enter the topic / How is today?" | Form Jurnal Refleksi Belajar |
| 7 | Alarm clock (jadwal yoga) | Pengingat jadwal belajar Geografi |
| 8 | "Delete item" dengan centang & silang | Konfirmasi hapus entri jurnal |

---

## 6. Aksesibilitas & Konsistensi

- Kontras teks **Earth Brown (#5F481E)** di atas **Warm Sand (#FFF0A3)** memenuhi rasio kontras AA untuk body text.
- Hindari menaruh teks kecil langsung di atas gradasi Sage Teal tanpa overlay card — gunakan card Cream White sebagai lapisan teks (sudah konsisten dengan referensi).
- Semua ikon status (terkunci/selesai/terhapus) wajib disertai label teks, tidak hanya warna, agar tetap jelas bagi siswa dengan gangguan penglihatan warna.
- Ukuran target sentuh minimal 44x44px untuk semua tombol & item list (standar Android Material/HIG).

---

## 7. Asset & Resource Notes

- Ilustrasi karakter & bioma direkomendasikan dibuat/diadaptasi dalam format **SVG/vektor** agar ringan di berbagai resolusi perangkat Android low-end.
- Font Poppins, Baloo 2, Inter, Nunito tersedia gratis di **Google Fonts** — aman untuk penggunaan skripsi/akademik maupun produk Android (lisensi OFL).
- Disarankan menyusun seluruh komponen di atas dalam 1 file **Figma** dengan struktur: `Cover → Color & Type → Components → Screens (per flow di App-Flow.md)`.

---

*Dokumen ini menjadi acuan visual pada tahap Development (ADDIE) dan dapat diserahkan ke ahli media sebagai bagian dari instrumen validasi desain.*
