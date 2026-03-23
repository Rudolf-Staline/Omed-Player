import { create } from 'zustand';

export type ThemeType = 'aurora' | 'sunset' | 'forest';
export type DensityType = 'compact' | 'normal' | 'comfortable';

interface SettingsState {
  theme: ThemeType;
  density: DensityType;
  animationsEnabled: boolean;

  setTheme: (theme: ThemeType) => void;
  setDensity: (density: DensityType) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
}

const loadSettings = () => {
  const defaults = {
    theme: 'aurora' as ThemeType,
    density: 'normal' as DensityType,
    animationsEnabled: true,
  };
  try {
    const data = localStorage.getItem('aurora_settings');
    if (data) {
      return { ...defaults, ...JSON.parse(data) };
    }
  } catch {
    // ignore
  }
  return defaults;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  ...loadSettings(),

  setTheme: (theme) => set((state) => {
    const newState = { ...state, theme };
    localStorage.setItem('aurora_settings', JSON.stringify(newState));
    return newState;
  }),
  setDensity: (density) => set((state) => {
    const newState = { ...state, density };
    localStorage.setItem('aurora_settings', JSON.stringify(newState));
    return newState;
  }),
  setAnimationsEnabled: (animationsEnabled) => set((state) => {
    const newState = { ...state, animationsEnabled };
    localStorage.setItem('aurora_settings', JSON.stringify(newState));
    return newState;
  }),
}));
