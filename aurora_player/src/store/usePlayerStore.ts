import { create } from 'zustand';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  artworkUrl?: string;
  url: string;
  duration?: number;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number; // 0 to 1
  currentTime: number;
  duration: number;
  queue: Track[];

  // Actions
  playTrack: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  currentTime: 0,
  duration: 0,
  queue: [],

  playTrack: (track) => set({ currentTrack: track, isPlaying: true, currentTime: 0, progress: 0 }),
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  clearQueue: () => set({ queue: [] }),
}));
