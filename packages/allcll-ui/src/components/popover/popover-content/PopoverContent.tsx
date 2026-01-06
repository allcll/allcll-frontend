import useDetectClose from '@/hooks/useDetectClose';
import { usePopoverContext } from '../popover/Popover';
import { createPortal } from 'react-dom';
import { useRef } from 'react';

function PopoverContent({ children }: { children: React.ReactNode }) {
  const { isOpen, close, open, triggerRef } = usePopoverContext();
  const contentRef = useRef<HTMLDivElement>(null);

  useDetectClose({
    elem: contentRef,
    tabRefs: triggerRef,
    isOpen,
    open,
    close,
  });

  if (!isOpen || !triggerRef.current) return null;

  const rect = triggerRef.current.getBoundingClientRect();

  return createPortal(
    <div
      ref={contentRef}
      className={`
        fixed rounded-md bg-white shadow-lg border border-gray-200 px-4 py-4
        transition-all duration-150 ease-out
        ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 -translate-y-1 scale-95 pointer-events-none'
        }
      `}
      style={{
        zIndex: 120,
        top: rect.bottom + 8,
        left: rect.left,
      }}
      onMouseDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body,
  );
}

export default PopoverContent;
