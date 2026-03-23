import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { TrackList } from '../music/TrackList';
import { Heart } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { localTracks, favorites } = usePlayerStore();

  // To show favorites, we filter the localTracks that match favorite IDs
  // In a real app, this would also include podcasts or tracks from a remote database
  const favoriteTracks = localTracks.filter(track => favorites.includes(track.id));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-rose to-accent-violet text-white shadow-lg glow-cyan">
          <Heart size={32} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Favorites</h1>
          <p className="text-text-muted mt-1">{favorites.length} items saved</p>
        </div>
      </div>

      {favoriteTracks.length > 0 ? (
        <TrackList tracks={favoriteTracks} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart size={48} className="text-white/10 mb-4" />
          <h2 className="text-xl font-display font-semibold text-text-primary mb-2">No favorites yet</h2>
          <p className="text-text-muted max-w-sm">
            Like a track or a podcast episode, and it will appear here for easy access. Note: Currently only local scanned tracks will populate this list.
          </p>
        </div>
      )}
    </div>
  );
};
