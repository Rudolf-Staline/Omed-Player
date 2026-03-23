import React from 'react';
import { Music, Podcast, Video, Settings, Library, Heart } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 flex-col border-r border-white/5 bg-bg-secondary p-4 hidden md:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan to-accent-violet text-white shadow-lg glow-cyan">
          <Music size={18} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-text-primary">Aurora</h1>
      </div>

      <nav className="space-y-6">
        <div>
          <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Discover</h2>
          <ul className="space-y-1">
            <li>
              <a href="#" className="flex items-center gap-3 rounded-lg bg-white/5 px-2 py-2 text-sm font-medium text-accent-cyan transition-colors hover:bg-white/10">
                <Music size={18} />
                <span>Music</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary">
                <Podcast size={18} />
                <span>Podcasts</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary">
                <Video size={18} />
                <span>Video</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Library</h2>
          <ul className="space-y-1">
            <li>
              <a href="#" className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary">
                <Library size={18} />
                <span>Local Files</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary">
                <Heart size={18} />
                <span>Favorites</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="mt-auto">
        <a href="#" className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary">
          <Settings size={18} />
          <span>Settings</span>
        </a>
      </div>
    </aside>
  );
};
