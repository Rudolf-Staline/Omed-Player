import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Subscription {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl600: string;
  feedUrl: string;
  subscribedAt: string;
  lastChecked: string;
  unplayedCount: number;
}

interface PodcastState {
  subscriptions: Subscription[];
  playedEpisodes: Record<string, boolean>; // episodeId -> true
  subscribe: (podcast: Omit<Subscription, 'subscribedAt' | 'lastChecked' | 'unplayedCount'>) => void;
  unsubscribe: (collectionId: number) => void;
  markAsPlayed: (episodeId: string) => void;
  isSubscribed: (collectionId: number) => boolean;
  markAllAsPlayed: (collectionId: number, episodeIds: string[]) => void;
}

export const usePodcastStore = create<PodcastState>()(
  persist(
    (set, get) => ({
      subscriptions: [],
      playedEpisodes: {},

      subscribe: (podcast) => {
        set((state) => {
          if (state.subscriptions.some(s => s.collectionId === podcast.collectionId)) {
            return state; // Already subscribed
          }
          const newSubscription: Subscription = {
            ...podcast,
            subscribedAt: new Date().toISOString(),
            lastChecked: new Date().toISOString(),
            unplayedCount: 0, // Should be calculated when fetching feed
          };
          return { subscriptions: [...state.subscriptions, newSubscription] };
        });
      },

      unsubscribe: (collectionId) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.collectionId !== collectionId),
        }));
      },

      markAsPlayed: (episodeId) => {
        set((state) => ({
          playedEpisodes: { ...state.playedEpisodes, [episodeId]: true }
        }));
      },
      
      markAllAsPlayed: (_collectionId, episodeIds) => {
         set((state) => {
             const newPlayed = { ...state.playedEpisodes };
             episodeIds.forEach(id => newPlayed[id] = true);
             return { playedEpisodes: newPlayed };
         });
      },

      isSubscribed: (collectionId) => {
        return get().subscriptions.some((s) => s.collectionId === collectionId);
      },
    }),
    {
      name: 'aurora-podcasts',
    }
  )
);
