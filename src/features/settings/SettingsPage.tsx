import React from 'react';
import { useSettingsStore, type ThemeType, type DensityType } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { usePlaylistStore } from '../../store/usePlaylistStore';
import { LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { theme, density, animationsEnabled, setTheme, setDensity, setAnimationsEnabled } = useSettingsStore();
  const { user, logout } = useAuthStore();

  const themes: { id: ThemeType; name: string; colors: string[] }[] = [
    { id: 'aurora', name: 'Omed Default', colors: ['bg-[#00E5FF]', 'bg-[#A855F7]'] },
    { id: 'sunset', name: 'Sunset', colors: ['bg-[#FF7B00]', 'bg-[#F472B6]'] },
    { id: 'forest', name: 'Forest', colors: ['bg-[#10B981]', 'bg-[#FBBF24]'] },
    { id: 'ocean', name: 'Ocean', colors: ['bg-[#0EA5E9]', 'bg-[#3B82F6]'] },
    { id: 'neon', name: 'Cyberpunk', colors: ['bg-[#EAB308]', 'bg-[#EC4899]'] },
    { id: 'midnight', name: 'Midnight', colors: ['bg-[#6366F1]', 'bg-[#14B8A6]'] },
    { id: 'peach', name: 'Peach', colors: ['bg-[#F43F5E]', 'bg-[#FB923C]'] },
  ];

  return (
    <div className="space-y-12 max-w-3xl pb-20">
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Settings</h1>
        <p className="text-text-muted">Customize your Omed experience.</p>
      </div>

      {/* Google Account Section */}
      <section className="bg-glass p-6 rounded-2xl border border-white/5">
        <h2 className="text-xl font-display font-semibold text-text-primary mb-6 border-b border-white/5 pb-2">
          Google Account
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
             {user?.avatar ? (
                 <img src={user.avatar} alt="Profile" className="w-16 h-16 rounded-full bg-white/10 object-cover" />
             ) : (
                 <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold">
                     {user?.name?.[0] || '?'}
                 </div>
             )}
             <div>
                 <p className="text-lg font-bold text-text-primary">{user?.name}</p>
                 <p className="text-sm text-text-muted">{user?.email}</p>
                 <p className="text-xs text-text-muted/60 mt-2 font-mono">Last synced: just now</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
             <button 
                 onClick={async () => {
                     const toastId = toast.loading('Syncing with Google Drive...');
                     await usePlaylistStore.getState().syncFromCloud();
                     toast.success('Sync complete!', { id: toastId });
                 }}
                 className="flex-1 sm:flex-none px-4 py-2 bg-accent-cyan text-bg-primary font-bold rounded-lg hover:opacity-90 transition-opacity"
             >
                 Sync Now
             </button>
             <button 
                 onClick={logout}
                 className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-accent-rose hover:bg-accent-rose/10 font-medium rounded-lg transition-colors border border-transparent hover:border-accent-rose/30"
             >
                 <LogOut size={16} /> Déconnexion
             </button>
          </div>
        </div>
      </section>

      {/* Theme Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-text-primary border-b border-white/5 pb-2">Appearance</h2>
        <div className="space-y-3">
          <p className="text-sm font-medium text-text-muted">Theme</p>
          <div className="flex flex-wrap gap-4">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  theme === t.id ? 'bg-white/10 border-accent-cyan shadow-sm glow-cyan' : 'bg-glass border-transparent hover:bg-white/5'
                }`}
              >
                <div className="flex -space-x-1">
                  <div className={`w-4 h-4 rounded-full ${t.colors[0]}`} />
                  <div className={`w-4 h-4 rounded-full ${t.colors[1]}`} />
                </div>
                <span className="text-sm font-medium text-text-primary">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Density Section */}
        <div className="space-y-3 pt-4">
          <p className="text-sm font-medium text-text-muted">Layout Density (Font Size)</p>
          <div className="flex bg-glass rounded-xl p-1 w-fit border border-white/5">
            {(['compact', 'normal', 'comfortable'] as DensityType[]).map((d) => (
              <button
                key={d}
                onClick={() => setDensity(d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  density === d ? 'bg-white/10 text-accent-cyan' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accessibility Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-text-primary border-b border-white/5 pb-2">Accessibility</h2>
        <div className="flex items-center justify-between p-4 bg-glass rounded-xl border border-white/5">
          <div>
            <p className="text-sm font-medium text-text-primary">Enable Animations</p>
            <p className="text-xs text-text-muted mt-1">Toggle page transitions and visual effects.</p>
          </div>
          <button
            onClick={() => setAnimationsEnabled(!animationsEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative ${animationsEnabled ? 'bg-accent-cyan' : 'bg-white/20'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${animationsEnabled ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </section>

    </div>
  );
};
