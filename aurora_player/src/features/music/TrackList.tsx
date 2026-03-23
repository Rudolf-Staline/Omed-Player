import React from 'react';
import { Play, MoreHorizontal, Heart } from 'lucide-react';
import { type Track } from '../../store/usePlayerStore';
import { audioEngine } from '../../core/audio_engine';

interface TrackListProps {
  tracks: Track[];
}

export const TrackList: React.FC<TrackListProps> = ({ tracks }) => {
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
              onDoubleClick={() => audioEngine.play(track)}
            >
              <td className="py-3 pl-4 text-text-muted w-12 text-sm">
                <span className="group-hover:hidden">{index + 1}</span>
                <button
                  onClick={() => audioEngine.play(track)}
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
              <td className="py-3 pr-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-end gap-3">
                  <button className="text-text-muted hover:text-accent-rose transition-colors">
                    <Heart size={16} />
                  </button>
                  <button className="text-text-muted hover:text-text-primary transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
