import { create } from 'zustand';
import { Progress } from '../types';

interface ProgressState {
  progressList: Progress[];
  setProgressList: (list: Progress[]) => void;
  updateProgress: (materiId: string, status: Progress['status']) => void;
  getProgressByMateriId: (materiId: string) => Progress | undefined;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progressList: [],
  
  setProgressList: (list) => set({ progressList: list }),
  
  updateProgress: (materiId, status) => set((state) => ({
    progressList: state.progressList.map(p =>
      p.materiId === materiId ? { ...p, status } : p
    )
  })),
  
  getProgressByMateriId: (materiId) => {
    return get().progressList.find(p => p.materiId === materiId);
  },
}));
