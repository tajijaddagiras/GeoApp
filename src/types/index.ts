// Type Definitions - Geo-Contextual App

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  nisn?: string;
  email?: string;
  role: UserRole;
  kelas?: string;
  createdAt: Date;
}

export interface Materi {
  id: string;
  title: string;
  kd: string; // Kompetensi Dasar
  konsep: string;
  studiKasus: string;
  imageUrl?: string;
  mapData?: {
    latitude: number;
    longitude: number;
    description: string;
  }[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Level {
  id: string;
  nama: string;       // e.g., "Level 1", "Level Mudah"
  poinPerSoal: number;
  durasiMenit: number;
  createdAt: Date;
}

export interface Soal {
  id: string;
  materiId: string;
  levelId?: string;
  pertanyaan: string;
  jawabanA: string;
  jawabanB: string;
  jawabanC: string;
  jawabanD: string;
  jawabanBenar: string;
  imageUrl?: string;
  order: number;
  createdAt: Date;
}

export interface Kuis {
  id: string;
  userId: string;
  materiId: string;
  skor: number;
  totalSoal: number;
  jawaban: number[]; // User's answers
  completedAt: Date;
}

export type MoodType = 'senang' | 'netral' | 'sedih' | 'semangat' | 'bingung';

export interface Jurnal {
  id: string;
  userId: string;
  materiId?: string;
  judul: string;
  isi: string;
  mood: MoodType;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Progress {
  id: string;
  userId: string;
  materiId: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  skor?: number;
  lastAccessed?: Date;
  completedAt?: Date;
}

export interface WorldClock {
  id: string;
  city: string;
  timezone: string;
  offset: number; // GMT offset in hours
}
