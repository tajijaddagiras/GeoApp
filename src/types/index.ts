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

export interface Soal {
  id: string;
  materiId: string;
  pertanyaan: string;
  pilihan: string[]; // Array of 4 choices
  kunciJawaban: number; // Index of correct answer (0-3)
  pembahasan?: string;
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
  lastAccessed?: Date;
  completedAt?: Date;
}

export interface WorldClock {
  id: string;
  city: string;
  timezone: string;
  offset: number; // GMT offset in hours
}
