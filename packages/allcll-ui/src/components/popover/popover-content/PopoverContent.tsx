import { usePopoverContext } from '../popover/Popover';
import { createPortal } from 'react-dom';

function PopoverContent({ children }: { children: React.ReactNode }) {
  const { isOpen, triggerRef } = usePopoverContext();
  if (!isOpen || !triggerRef.current) return null;

  const rect = triggerRef.current.getBoundingClientRect();

  return createPortal(
    <div
      className="fixed z-50 rounded-md bg-white shadow-lg p-4"
      style={{
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
