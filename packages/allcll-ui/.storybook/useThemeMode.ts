import { useContext, useEffect, useState } from 'react';
import { DocsContext } from '@storybook/addon-docs/blocks';

export type ThemeMode = 'light' | 'dark' | 'compare';

type Globals = Record<string, unknown>;

const GLOBALS_UPDATED = 'globalsUpdated';

function toThemeMode(globals?: Globals): ThemeMode {
  const theme = globals?.theme;
  return theme === 'dark' || theme === 'compare' ? theme : 'light';
}

export function useThemeMode(): ThemeMode {
  const context = useContext(DocsContext);
  const [mode, setMode] = useState<ThemeMode>(() => {
    const { store } = context as unknown as { store?: { userGlobals?: { get: () => Globals } } };
    return toThemeMode(store?.userGlobals?.get());
  });

  useEffect(() => {
    const handleUpdate = ({ globals }: { globals: Globals }) => setMode(toThemeMode(globals));
    context.channel.on(GLOBALS_UPDATED, handleUpdate);
    return () => context.channel.off(GLOBALS_UPDATED, handleUpdate);
  }, [context]);

  return mode;
}
