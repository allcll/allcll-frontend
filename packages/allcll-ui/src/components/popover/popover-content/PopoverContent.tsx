import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePopoverContext } from '../popover/Popover';
import useDetectClose from '../../../hooks/useDetectClose';
import { Z_INDEX } from '../../../../zIndex';
import { PopoverContentContext } from './PopoverContentContext';

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
        fixed rounded-lg bg-white shadow-lg border border-gray-200 p-3
        transition-all duration-150 ease-out
        ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 -translate-y-1 scale-95 pointer-events-none'
        }
      `}
      style={{
        zIndex: Z_INDEX.popover,
        top: rect.bottom + 8,
        left: rect.left,
        minWidth: rect.width,
      }}
      onMouseDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
    >
      <PopoverContentContext.Provider value={true}>{children}</PopoverContentContext.Provider>
    </div>,
    document.body,
  );
}

export default PopoverContent;
