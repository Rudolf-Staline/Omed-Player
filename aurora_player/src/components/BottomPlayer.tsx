import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Repeat, Shuffle, Heart, ListMusic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { audioEngine } from '../core/audio_engine';
import { QueuePanel } from './QueuePanel';

import { useSettingsStore } from '../store/useSettingsStore';

export const BottomPlayer: React.FC = () => {
  const { currentTrack, isPlaying, progress, currentTime, duration, volume, repeatMode, isShuffle, playNext, playPrevious, toggleShuffle, toggleRepeatMode, queue } = usePlayerStore();
  const { trackIds: favorites, toggleTrackFavorite: toggleFavorite } = useFavoritesStore();
  const { animationsEnabled } = useSettingsStore();
  const prevTrackId = useRef<string | undefined>(undefined);
  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    if (currentTrack && currentTrack.id !== prevTrackId.current) {
      audioEngine.play(currentTrack);
      prevTrackId.current = currentTrack.id;
    }
  }, [currentTrack]);

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
    <motion.div
      initial={animationsEnabled ? { y: '100%' } : false}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-24 w-full border-t border-white/10 bg-glass px-6 py-2 shadow-2xl backdrop-blur-xl z-50"
    >
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
          {currentTrack && (
            <button
              onClick={() => toggleFavorite(currentTrack.id)}
              className={`transition-colors ml-2 ${favorites.includes(currentTrack.id) ? 'text-accent-rose' : 'text-text-muted hover:text-accent-rose'}`}
            >
              <Heart size={18} fill={favorites.includes(currentTrack.id) ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        {/* Player Controls */}
        <div className="flex w-2/4 flex-col items-center gap-2">
          <div className="flex items-center gap-6">
            <button
              onClick={toggleShuffle}
              className={`transition-colors relative ${isShuffle ? 'text-accent-cyan' : 'text-text-muted hover:text-text-primary'}`}
            >
              <Shuffle size={18} />
              {isShuffle && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-cyan rounded-full" />}
            </button>
            <button
              onClick={playPrevious}
              className="text-text-primary hover:text-accent-cyan transition-colors"
            >
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
            <button
              onClick={playNext}
              className="text-text-primary hover:text-accent-cyan transition-colors"
            >
              <SkipForward size={20} fill="currentColor" />
            </button>
            <button
              onClick={toggleRepeatMode}
              className={`transition-colors relative ${repeatMode !== 'none' ? 'text-accent-cyan' : 'text-text-muted hover:text-text-primary'}`}
            >
              <Repeat size={18} />
              {repeatMode === 'one' && <span className="absolute -top-1 -right-1 text-[8px] font-bold bg-bg-secondary rounded-full w-3 h-3 flex items-center justify-center">1</span>}
              {repeatMode !== 'none' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-cyan rounded-full" />}
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
        <div className="flex w-1/4 items-center justify-end gap-4 relative">
          <button
            className={`text-text-muted hover:text-text-primary transition-colors relative ${showQueue ? 'text-accent-cyan' : ''}`}
            onClick={() => setShowQueue(!showQueue)}
          >
            <ListMusic size={18} />
            {queue.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent-cyan text-bg-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {queue.length}
              </span>
            )}
          </button>
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

      <AnimatePresence>
        {showQueue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-4 mr-6"
          >
            <QueuePanel onClose={() => setShowQueue(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
