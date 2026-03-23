import React, { useState } from 'react';
import { Play, MoreHorizontal, Heart, Plus } from 'lucide-react';
import { usePlayerStore, type Track } from '../../store/usePlayerStore';
import { usePlaylistStore } from '../../store/usePlaylistStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';

interface TrackListProps {
  tracks: Track[];
}

export const TrackList: React.FC<TrackListProps> = ({ tracks }) => {
  const { trackIds: favorites, toggleTrackFavorite: toggleFavorite } = useFavoritesStore();
  const { playlists, addTrackToPlaylist } = usePlaylistStore();
  const [contextMenuId, setContextMenuId] = useState<string | null>(null);

  return (
    <div className="w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-text-muted">
            <th className="py-4 pl-4 font-medium">#</th>
            <th className="py-4 font-medium">Title</th>
            <th className="py-4 font-medium hidden md:table-cell">Album</th>
            <th className="py-4 pr-4 text-right font-medium">Duration</th>
            <th className="py-4 w-12"></th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => (
            <tr
              key={track.id}
              className="group border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
              onDoubleClick={() => usePlayerStore.getState().playTrack(track)}
            >
              <td className="py-3 pl-4 text-text-muted w-12 text-sm">
                <span className="group-hover:hidden">{index + 1}</span>
                <button
                  onClick={() => usePlayerStore.getState().playTrack(track)}
                  className="hidden group-hover:flex text-accent-cyan"
                >
                  <Play size={16} fill="currentColor" />
                </button>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-3">
                  {track.artworkUrl && (
                    <img src={track.artworkUrl} alt={track.album} className="h-10 w-10 rounded shadow-md object-cover" />
                  )}
                  <div>
                    <div className="font-medium text-text-primary text-sm line-clamp-1">{track.title}</div>
                    <div className="text-xs text-text-muted line-clamp-1">{track.artist}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 text-sm text-text-muted hidden md:table-cell line-clamp-1">
                {track.album}
              </td>
              <td className="py-3 pr-4 text-right text-sm text-text-muted font-mono">
                {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : '--:--'}
              </td>
              <td className="py-3 pr-4 text-right relative">
                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
                    className={`transition-colors ${favorites.includes(track.id) ? 'text-accent-rose' : 'text-text-muted hover:text-accent-rose'}`}
                  >
                    <Heart size={16} fill={favorites.includes(track.id) ? 'currentColor' : 'none'} />
                  </button>
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setContextMenuId(contextMenuId === track.id ? null : track.id); }}
                      className="text-text-muted hover:text-text-primary transition-colors p-1"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {contextMenuId === track.id && (
                       <div className="absolute right-0 top-full mt-1 w-48 bg-bg-secondary border border-white/10 rounded-lg shadow-xl z-50 py-1 text-sm overflow-hidden text-left">
                           <div className="px-3 py-1 text-xs font-semibold text-text-muted uppercase tracking-wider bg-white/5 mb-1">Add to Playlist</div>
                           {playlists.length === 0 ? (
                               <div className="px-3 py-2 text-text-muted text-xs italic">No playlists created</div>
                           ) : (
                               playlists.map(p => (
                                   <button
                                      key={p.id}
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          addTrackToPlaylist(p.id, track);
                                          setContextMenuId(null);
                                      }}
                                      className="w-full px-3 py-2 text-left flex items-center gap-2 text-text-primary hover:bg-white/10 transition-colors truncate"
                                      title={p.name}
                                   >
                                      <Plus size={14} className="shrink-0" /> {p.name}
                                   </button>
                               ))
                           )}
                       </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
