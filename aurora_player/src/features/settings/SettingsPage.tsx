import React from 'react';
import { useSettingsStore, type ThemeType, type DensityType } from '../../store/useSettingsStore';

export const SettingsPage: React.FC = () => {
  const { theme, density, animationsEnabled, setTheme, setDensity, setAnimationsEnabled } = useSettingsStore();

  const themes: { id: ThemeType; name: string; colors: string[] }[] = [
    { id: 'aurora', name: 'Aurora Boreale', colors: ['bg-[#00E5FF]', 'bg-[#A855F7]'] },
    { id: 'sunset', name: 'Sunset', colors: ['bg-[#FF7B00]', 'bg-[#F472B6]'] },
    { id: 'forest', name: 'Forest', colors: ['bg-[#10B981]', 'bg-[#FBBF24]'] },
  ];

  return (
    <div className="space-y-12 max-w-3xl pb-20">
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Settings</h1>
        <p className="text-text-muted">Customize your Aurora Player experience.</p>
      </div>

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
