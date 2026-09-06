import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface IUseDocumentPiPOptions {
  width?: number;
  height?: number;
}

const DEFAULT_PIP_WIDTH = 380;
const DEFAULT_PIP_HEIGHT = 440;

export function useDocumentPiP(options: IUseDocumentPiPOptions = {}) {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const pipContainerRef = useRef<HTMLDivElement | null>(null);
  const pipWindowRef = useRef<Window | null>(null);

  useEffect(() => {
    pipWindowRef.current = pipWindow;
  }, [pipWindow]);

  useEffect(() => {
    setIsSupported('documentPictureInPicture' in window);

    return () => {
      if (pipWindowRef.current) {
        pipWindowRef.current.close();
        pipWindowRef.current = null;
      }
    };
  }, []);

  const openPiP = useCallback(async () => {
    if (!('documentPictureInPicture' in window) || !window.documentPictureInPicture) {
      alert('이 브라우저는 Document Picture-in-Picture API를 지원하지 않습니다. (Chrome 116+ 이상 권장)');
      return;
    }

    if (pipWindow) {
      pipWindow.focus();
      return;
    }

    try {
      const win = await window.documentPictureInPicture.requestWindow({
        width: options.width ?? DEFAULT_PIP_WIDTH,
        height: options.height ?? DEFAULT_PIP_HEIGHT,
      });

      // Copy style elements & link tags from main document to PiP window
      Array.from(document.styleSheets).forEach(styleSheet => {
        try {
          if (styleSheet.cssRules) {
            const newStyle = win.document.createElement('style');
            Array.from(styleSheet.cssRules).forEach(rule => {
              newStyle.appendChild(win.document.createTextNode(rule.cssText));
            });
            win.document.head.appendChild(newStyle);
          } else if (styleSheet.href) {
            const newLink = win.document.createElement('link');
            newLink.rel = 'stylesheet';
            newLink.type = styleSheet.type || 'text/css';
            newLink.href = styleSheet.href;
            win.document.head.appendChild(newLink);
          }
        } catch (e) {
          if (styleSheet.href) {
            const newLink = win.document.createElement('link');
            newLink.rel = 'stylesheet';
            newLink.type = styleSheet.type || 'text/css';
            newLink.href = styleSheet.href;
            win.document.head.appendChild(newLink);
          }
        }
      });

      win.document.title = 'ALLCLL | 실시간 여석 (PiP)';
      win.document.body.className = 'bg-gray-50 p-4 m-0 overflow-y-auto font-sans';

      const container = win.document.createElement('div');
      container.id = 'pip-root';
      win.document.body.appendChild(container);
      pipContainerRef.current = container;

      win.addEventListener('pagehide', () => {
        setPipWindow(null);
        pipContainerRef.current = null;
      });

      setPipWindow(win);
    } catch (err) {
      console.error('Failed to open Picture-in-Picture window:', err);
    }
  }, [options.width, options.height, pipWindow]);

  const closePiP = useCallback(() => {
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
      pipContainerRef.current = null;
    }
  }, [pipWindow]);

  const renderPiPPortal = useCallback(
    (children: React.ReactNode) => {
      if (!pipWindow || !pipContainerRef.current) return null;
      return createPortal(children, pipContainerRef.current);
    },
    [pipWindow]
  );

  return {
    isSupported,
    isPiPOpen: Boolean(pipWindow),
    pipWindow,
    openPiP,
    closePiP,
    renderPiPPortal,
  };
}

export default useDocumentPiP;
