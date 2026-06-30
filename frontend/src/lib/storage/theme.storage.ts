import { STORAGE_KEYS } from '@/constants/storage';

type Theme = 'light' | 'dark' | 'system';

export const themeStorage = {
  getTheme(): Theme {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) || 'system';
  },
  
  setTheme(theme: Theme) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
};
