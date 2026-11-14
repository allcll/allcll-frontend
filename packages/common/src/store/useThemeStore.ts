import { useEffect, useSyncExternalStore } from 'react';
import { create } from 'zustand';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

// index.html 인라인 스크립트에서도 읽는 키이므로 변경 시 함께 수정 필요
const STORAGE_KEY = 'allcll-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

interface ThemeStore {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return 'system';
  }
}

export const useThemeStore = create<ThemeStore>()(set => ({
  preference: readPreference(),
  setPreference: preference => {
    try {
      if (preference === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // ignore
    }
    set({ preference });
  },
}));

function subscribeSystemTheme(onChange: () => void) {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

function useResolvedTheme(): ResolvedTheme {
  const preference = useThemeStore(s => s.preference);
  const systemTheme = useSyncExternalStore(subscribeSystemTheme, getSystemTheme);
  return preference === 'system' ? systemTheme : preference;
}

export function useApplyTheme() {
  const theme = useResolvedTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
}
