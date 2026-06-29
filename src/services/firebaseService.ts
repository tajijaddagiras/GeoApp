import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  writeBatch,
  setDoc
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { Materi, Soal, User, Progress, Jurnal } from '../types';

// ==================== AUTHENTICATION ====================

export const signUp = async (data: {
  name: string;
  nisn: string;
  kelas: string;
  email: string;
  password: string;
  kodeAktivasi?: string;
}): Promise<User> => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Update profile with name
    await updateProfile(userCredential.user, {
      displayName: data.name,
    });

    // Create new user profile
    const newUser: Omit<User, 'id'> = {
      name: data.name,
      email: data.email,
      nisn: data.nisn,
      kelas: data.kelas,
      role: 'user',
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), newUser);

    return {
      id: userCredential.user.uid,
      ...newUser,
    };
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw new Error(error.message || 'Pendaftaran gagal');
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('Data pengguna tidak ditemukan');
    }

    const userData = userDoc.data();
    return {
      id: userDoc.id,
      ...userData,
    } as User;
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new Error(error.message || 'Login gagal');
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error(error.message || 'Logout gagal');
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (!userDoc.exists()) return null;

    const userData = userDoc.data();
    return {
      id: userDoc.id,
      ...userData,
    } as User;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

// ==================== MATERI CRUD ====================

export const getAllMateri = async (): Promise<Materi[]> => {
  try {
    const q = query(collection(db, 'materi'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Materi[];
  } catch (error) {
    console.error('Get all materi error:', error);
    throw error;
  }
};

export const getMateriById = async (id: string): Promise<Materi | null> => {
  try {
    const docRef = doc(db, 'materi', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Materi;
  } catch (error) {
    console.error('Get materi by id error:', error);
    throw error;
  }
};

export const createMateri = async (materi: Omit<Materi, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'materi'), {
      ...materi,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Create materi error:', error);
    throw error;
  }
};

export const updateMateri = async (id: string, materi: Partial<Materi>): Promise<void> => {
  try {
    const docRef = doc(db, 'materi', id);
    await updateDoc(docRef, {
      ...materi,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Update materi error:', error);
    throw error;
  }
};

export const deleteMateri = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'materi', id));
  } catch (error) {
    console.error('Delete materi error:', error);
    throw error;
  }
};

// ==================== SOAL CRUD ====================

export const getSoalByMateriId = async (materiId: string): Promise<Soal[]> => {
  try {
    const q = query(
      collection(db, 'soal'),
      where('materiId', '==', materiId),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Soal[];
  } catch (error) {
    console.error('Get soal by materi id error:', error);
    throw error;
  }
};

export const createSoal = async (soal: Omit<Soal, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'soal'), {
      ...soal,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Create soal error:', error);
    throw error;
  }
};

export const updateSoal = async (id: string, soal: Partial<Soal>): Promise<void> => {
  try {
    const docRef = doc(db, 'soal', id);
    await updateDoc(docRef, soal);
  } catch (error) {
    console.error('Update soal error:', error);
    throw error;
  }
};

export const deleteSoal = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'soal', id));
  } catch (error) {
    console.error('Delete soal error:', error);
    throw error;
  }
};

// ==================== PROGRESS ====================

export const getProgressByUserId = async (userId: string): Promise<Progress[]> => {
  try {
    const q = query(collection(db, 'progres'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Progress[];
  } catch (error) {
    console.error('Get progress by user id error:', error);
    throw error;
  }
};

export const updateProgress = async (
  userId: string,
  materiId: string,
  data: Partial<Progress>
): Promise<void> => {
  try {
    // Check if progress exists
    const q = query(
      collection(db, 'progres'),
      where('userId', '==', userId),
      where('materiId', '==', materiId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Create new progress
      await addDoc(collection(db, 'progres'), {
        userId,
        materiId,
        ...data,
        updatedAt: Timestamp.now(),
      });
    } else {
      // Update existing progress
      const docRef = doc(db, 'progres', snapshot.docs[0].id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Update progress error:', error);
    throw error;
  }
};

// ==================== JURNAL CRUD ====================

export const getJurnalByUserId = async (userId: string): Promise<Jurnal[]> => {
  try {
    const q = query(
      collection(db, 'jurnal'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Jurnal[];
  } catch (error) {
    console.error('Get jurnal by user id error:', error);
    throw error;
  }
};

export const createJurnal = async (jurnal: Omit<Jurnal, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'jurnal'), {
      ...jurnal,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Create jurnal error:', error);
    throw error;
  }
};

export const updateJurnal = async (id: string, jurnal: Partial<Jurnal>): Promise<void> => {
  try {
    const docRef = doc(db, 'jurnal', id);
    await updateDoc(docRef, {
      ...jurnal,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Update jurnal error:', error);
    throw error;
  }
};

export const deleteJurnal = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'jurnal', id));
  } catch (error) {
    console.error('Delete jurnal error:', error);
    throw error;
  }
};

// ==================== USERS (Admin) ====================

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
};

export const updateUser = async (id: string, data: Partial<User>): Promise<void> => {
  try {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'users', id));
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

// ==================== STATISTICS (Admin) ====================

export const getStatistics = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const materiSnapshot = await getDocs(collection(db, 'materi'));
    const soalSnapshot = await getDocs(collection(db, 'soal'));
    const progresSnapshot = await getDocs(collection(db, 'progres'));

    const users = usersSnapshot.docs.filter(doc => doc.data().role === 'user');
    
    // Calculate average progress
    let totalProgress = 0;
    let totalScore = 0;
    let scoreCount = 0;

    progresSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.status === 'completed') totalProgress++;
      if (data.skor !== undefined) {
        totalScore += data.skor;
        scoreCount++;
      }
    });

    const avgProgress = users.length > 0 ? 
      (totalProgress / (users.length * materiSnapshot.size)) * 100 : 0;
    const avgScore = scoreCount > 0 ? totalScore / scoreCount : 0;

    return {
      totalPengguna: users.length,
      penggunaAktif: users.length, // Simplified
      totalMateri: materiSnapshot.size,
      totalSoal: soalSnapshot.size,
      rataRataProgres: Math.round(avgProgress),
      rataRataNilai: Math.round(avgScore),
    };
  } catch (error) {
    console.error('Get statistics error:', error);
    throw error;
  }
};
