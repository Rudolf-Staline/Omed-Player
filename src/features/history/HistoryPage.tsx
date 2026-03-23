import React from 'react';
import { History, Trash2, Clock } from 'lucide-react';
import { useHistoryStore } from '../../store/useHistoryStore';
import { TrackList } from '../music/TrackList';
import { type Track } from '../../store/usePlayerStore';
import { audioEngine } from '../../core/audio_engine';
import { toast } from 'react-hot-toast';

export const HistoryPage: React.FC = () => {
  const { history, clearHistory } = useHistoryStore();

  const handlePlayHistory = (track: Track) => {
    if (!track.url) {
      toast.error('Cannot play this track: URL missing from history.');
      return;
    }
    audioEngine.playAndStart(track);
  };

  const tracks: Track[] = history.map((entry, index) => ({
    id: `${entry.trackId}-${index}`, // make unique if played multiple times
    title: entry.title,
    artist: entry.artist,
    album: entry.source === 'podcast' ? 'Podcast Episode' : (entry.source === 'drive' ? 'Google Drive' : 'Local File'),
    artworkUrl: entry.artworkUrl,
    url: entry.url || '',
    duration: entry.duration,
  }));

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary flex items-center gap-3">
              <History className="text-accent-cyan" size={28} />
              Listening History
          </h1>
          <p className="text-sm text-text-muted mt-2">Your recently played tracks and podcasts</p>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your listening history?')) {
                clearHistory();
                toast.success('History cleared');
              }
            }}
            className="flex items-center gap-2 bg-accent-rose/10 hover:bg-accent-rose/20 text-accent-rose px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-accent-rose/20"
          >
            <Trash2 size={16} />
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted gap-4 bg-glass rounded-2xl border border-white/5">
            <Clock size={48} className="opacity-20" />
            <h2 className="text-xl font-bold text-text-primary">No History Yet</h2>
            <p>Listen to some music or podcasts, and they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
           {/* Reusing TrackList since it maps nicely to a table of tracks */}
           <TrackList tracks={tracks} onPlayContext={handlePlayHistory} />
        </div>
      )}
    </div>
  );
};
