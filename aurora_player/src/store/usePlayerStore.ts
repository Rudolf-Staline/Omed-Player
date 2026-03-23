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
  localTracks: Track[];
  favorites: string[]; // Store track IDs
  repeatMode: 'none' | 'all' | 'one';
  isShuffle: boolean;

  // Actions
  playTrack: (track: Track) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  toggleRepeatMode: () => void;
  pause: () => void;
  resume: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
  setLocalTracks: (tracks: Track[]) => void;
  toggleFavorite: (trackId: string) => void;
}

const loadFavorites = (): string[] => {
  try {
    const data = localStorage.getItem('aurora_favorites');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  currentTime: 0,
  duration: 0,
  queue: [],
  localTracks: [],
  favorites: loadFavorites(),
  repeatMode: 'none',
  isShuffle: false,

  playTrack: (track) => set({ currentTrack: track, isPlaying: true, currentTime: 0, progress: 0 }),
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  clearQueue: () => set({ queue: [] }),
  setLocalTracks: (tracks) => set({ localTracks: tracks }),
  toggleFavorite: (trackId) => set((state) => {
    const isFav = state.favorites.includes(trackId);
    const newFavs = isFav ? state.favorites.filter(id => id !== trackId) : [...state.favorites, trackId];
    localStorage.setItem('aurora_favorites', JSON.stringify(newFavs));
    return { favorites: newFavs };
  }),
  playNext: () => {
    const { currentTrack, localTracks, isShuffle, repeatMode, playTrack } = get();
    if (!currentTrack || localTracks.length === 0) return;

    if (repeatMode === 'one') {
      // Just play the same track again
      playTrack(currentTrack);
      // Wait for audio engine to handle the state change if needed, but typically we trigger play
      return;
    }

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * localTracks.length);
      playTrack(localTracks[randomIndex]);
      return;
    }

    const currentIndex = localTracks.findIndex(t => t.id === currentTrack.id);
    let nextIndex = currentIndex + 1;

    if (nextIndex >= localTracks.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        // Stop playing
        get().pause();
        return;
      }
    }
    playTrack(localTracks[nextIndex]);
  },
  playPrevious: () => {
    const { currentTrack, localTracks, currentTime, playTrack } = get();
    if (!currentTrack || localTracks.length === 0) return;

    // If we've played more than 3 seconds, previous restarts the current track
    if (currentTime > 3) {
      playTrack(currentTrack);
      return;
    }

    const currentIndex = localTracks.findIndex(t => t.id === currentTrack.id);
    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
       prevIndex = localTracks.length - 1;
    }

    playTrack(localTracks[prevIndex]);
  },
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  toggleRepeatMode: () => set((state) => {
    const modes: ('none' | 'all' | 'one')[] = ['none', 'all', 'one'];
    const nextIndex = (modes.indexOf(state.repeatMode) + 1) % modes.length;
    return { repeatMode: modes[nextIndex] };
  }),
}));
