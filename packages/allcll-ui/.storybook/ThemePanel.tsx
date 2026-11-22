import { type ReactNode, useState } from 'react';
import { PortalContainerContext } from '../src/config/portalContainer';

const PANEL_STYLE = { padding: 24, borderRadius: 8, border: '1px solid var(--allcll-line)' };

interface IThemePanel {
  theme: 'light' | 'dark';
  height?: number;
  children: ReactNode;
}

export default function ThemePanel({ theme, height, children }: Readonly<IThemePanel>) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div
      ref={setContainer}
      className={`${theme} bg-background text-fg`}
      style={{
        ...PANEL_STYLE,
        transform: 'translateZ(0)',
        ...(height && { height, overflow: 'hidden' }),
      }}
    >
      <PortalContainerContext.Provider value={container}>{children}</PortalContainerContext.Provider>
    </div>
  );
}
