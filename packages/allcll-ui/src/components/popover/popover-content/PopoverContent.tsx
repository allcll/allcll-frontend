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
      className="fixed rounded-md bg-white shadow-lg px-4 py-4"
      ref={contentRef}
      onMouseDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
      style={{
        zIndex: 120,
        top: rect.bottom + 8,
        left: rect.left,
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

export default PopoverContent;
