import { useRef, useState, useEffect } from 'react';

export function usePopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const open = () => {
    setIsOpen(true);
    calculatePosition();
  };

  const close = () => setIsOpen(false);

  const calculatePosition = () => {
    if (triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = triggerRect.left;
      let y = triggerRect.bottom;

      if (triggerRect.right + contentRect.width > viewportWidth) {
        x = triggerRect.right - contentRect.width;
      }

      if (triggerRect.bottom + contentRect.height > viewportHeight) {
        y = -contentRect.height;
      }

      setPosition({ x, y });
    }
  };

  useEffect(() => {
    if (isOpen) window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [isOpen]);

  return { isOpen, open, close, triggerRef, contentRef, position };
}
