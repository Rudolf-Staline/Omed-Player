import React, { useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Repeat, Shuffle } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { audioEngine } from '../core/audio_engine';

export const BottomPlayer: React.FC = () => {
  const { currentTrack, isPlaying, progress, currentTime, duration, volume } = usePlayerStore();

  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!currentTrack) return;
    audioEngine.togglePlay();
  };

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!currentTrack || duration <= 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percent = clickX / rect.width;
      audioEngine.seek(percent * duration);
    },
    [currentTrack, duration]
  );

  const handleVolumeClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, clickX / rect.width));
    audioEngine.setVolume(newVolume);
  }, []);

  return (
    <div className="h-24 w-full border-t border-white/10 bg-glass px-6 py-2 shadow-2xl backdrop-blur-xl z-50">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between">

        {/* Track Info */}
        <div className="flex w-1/4 items-center gap-4">
          <div className="h-14 w-14 overflow-hidden rounded-lg shadow-lg shadow-accent-violet/20 bg-white/5 flex items-center justify-center">
            {currentTrack?.artworkUrl ? (
              <img src={currentTrack.artworkUrl} alt={currentTrack.album} className="h-full w-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/10" />
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <h4 className="font-display font-medium text-text-primary text-sm line-clamp-1">
              {currentTrack?.title || 'No Track Selected'}
            </h4>
            <p className="text-xs text-text-muted line-clamp-1">
              {currentTrack?.artist || 'Unknown Artist'}
            </p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex w-2/4 flex-col items-center gap-2">
          <div className="flex items-center gap-6">
            <button className="text-text-muted hover:text-text-primary transition-colors">
              <Shuffle size={18} />
            </button>
            <button className="text-text-primary hover:text-accent-cyan transition-colors">
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button
              onClick={handlePlayPause}
              disabled={!currentTrack}
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-text-primary text-bg-primary transition-transform ${currentTrack ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
            >
              {isPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" className="ml-1" />
              )}
            </button>
            <button className="text-text-primary hover:text-accent-cyan transition-colors">
              <SkipForward size={20} fill="currentColor" />
            </button>
            <button className="text-text-muted hover:text-text-primary transition-colors">
              <Repeat size={18} />
            </button>
          </div>
          <div className="flex w-full items-center gap-2 max-w-md">
            <span className="text-xs text-text-muted font-mono w-10 text-right">{formatTime(currentTime)}</span>
            <div
              className="relative h-1 flex-1 cursor-pointer rounded-full bg-white/10 overflow-hidden"
              onClick={handleProgressClick}
            >
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent-cyan to-accent-violet rounded-full glow-cyan"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="text-xs text-text-muted font-mono w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Secondary Controls */}
        <div className="flex w-1/4 items-center justify-end gap-4">
          <button className="text-text-muted hover:text-text-primary transition-colors">
            <Volume2 size={18} />
          </button>
          <div
            className="relative h-1 w-24 cursor-pointer rounded-full bg-white/10"
            onClick={handleVolumeClick}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-text-primary"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
          <button className="text-text-muted hover:text-text-primary transition-colors ml-2">
            <Maximize2 size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};
