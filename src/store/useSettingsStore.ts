import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'aurora' | 'sunset' | 'forest' | 'ocean' | 'neon' | 'midnight' | 'peach';
export type DensityType = 'compact' | 'normal' | 'comfortable';

interface SettingsState {
  theme: ThemeType;
  density: DensityType;
  animationsEnabled: boolean;
  geminiApiKey: string;
  
  setTheme: (theme: ThemeType) => void;
  setDensity: (density: DensityType) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setGeminiApiKey: (key: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'aurora',
      density: 'normal',
      animationsEnabled: true,
      geminiApiKey: '',

      setTheme: (theme) => set({ theme }),
      setDensity: (density) => set({ density }),
      setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
      setGeminiApiKey: (geminiApiKey) => set({ geminiApiKey }),
    }),
    {
      name: 'aurora_settings',
      partialize: (state) => ({
        theme: state.theme,
        density: state.density,
        animationsEnabled: state.animationsEnabled,
        geminiApiKey: state.geminiApiKey,
      }),
    }
  )
);
