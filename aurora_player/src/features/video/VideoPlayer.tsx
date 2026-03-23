import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Maximize, PictureInPicture, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  poster = "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
  title = "Big Buck Bunny"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);

  let controlsTimeout: number | undefined;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const toggleFullScreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const togglePiP = async () => {
    if (videoRef.current) {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    if (isPlaying) {
      controlsTimeout = window.setTimeout(() => setShowControls(false), 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Video Player</h1>
          <p className="text-sm text-text-muted mt-1">Cinematic Mode</p>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group shadow-2xl glow-cyan"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onClick={togglePlay}
        />

        {/* Controls Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-white font-medium px-2">{title}</h3>

            {/* Progress Bar */}
            <div
              className="h-1.5 w-full bg-white/20 rounded-full cursor-pointer relative group-hover/progress:h-2 transition-all"
              onClick={handleProgressClick}
            >
              <div
                className="absolute top-0 left-0 h-full bg-accent-cyan rounded-full glow-cyan"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="text-white hover:text-accent-cyan transition-colors">
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>
                <button onClick={toggleMute} className="text-white hover:text-accent-cyan transition-colors">
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={togglePiP} className="text-white hover:text-accent-cyan transition-colors" title="Picture in Picture">
                  <PictureInPicture size={20} />
                </button>
                <button onClick={toggleFullScreen} className="text-white hover:text-accent-cyan transition-colors" title="Fullscreen">
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Play Overlay (Big button when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 p-4 rounded-full backdrop-blur-sm border border-white/10 glow-cyan">
              <Play size={48} className="text-accent-cyan ml-2" fill="currentColor" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
