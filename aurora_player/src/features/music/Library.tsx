import React from 'react';
import { Play } from 'lucide-react';
import { audioEngine } from '../../core/audio_engine';
import { type Track } from '../../store/usePlayerStore';

const mockAlbums = [
  { id: '1', title: 'Neon Nights', artist: 'Synthwave Dreamer', year: 2024, coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop' },
  { id: '2', title: 'Midnight City', artist: 'The Midnight', year: 2022, coverUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=300&auto=format&fit=crop' },
  { id: '3', title: 'Cyberpunk Drive', artist: 'LazerHawk', year: 2023, coverUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=300&auto=format&fit=crop' },
  { id: '4', title: 'Future Funk', artist: 'Macross 82-99', year: 2021, coverUrl: 'https://images.unsplash.com/photo-1516280440502-31627c234b6f?q=80&w=300&auto=format&fit=crop' },
  { id: '5', title: 'Retrowave', artist: 'Kavinsky', year: 2013, coverUrl: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f57bb8?q=80&w=300&auto=format&fit=crop' },
];

export const Library: React.FC = () => {
  const handlePlayDemo = (album: typeof mockAlbums[0]) => {
    const mockTrack: Track = {
      id: `demo-${album.id}`,
      title: `${album.title} - Intro`,
      artist: album.artist,
      album: album.title,
      artworkUrl: album.coverUrl,
      // Using a free sample audio URL
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    };
    audioEngine.play(mockTrack);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Music Library</h1>
          <p className="text-sm text-text-muted mt-1">Your local collection</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {mockAlbums.map((album) => (
          <div key={album.id} className="group bg-glass p-3 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
            <div className="aspect-square w-full rounded-lg overflow-hidden shadow-lg mb-4 relative">
              <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayDemo(album);
                  }}
                  className="bg-accent-cyan text-bg-primary rounded-full p-3 shadow-lg glow-cyan transform translate-y-4 group-hover:translate-y-0 transition-all"
                >
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-text-primary text-sm truncate">{album.title}</h3>
            <p className="text-xs text-text-muted mt-1 truncate">{album.artist} • {album.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
