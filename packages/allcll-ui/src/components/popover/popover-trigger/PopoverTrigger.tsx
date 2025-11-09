import { usePopoverContext } from '../popover/Popover';

function PopoverTrigger({ children }: { children: React.ReactNode }) {
  const { open, close, isOpen, triggerRef } = usePopoverContext();

  return (
    <button type="button" onClick={isOpen ? close : open} ref={triggerRef}>
      {children}
    </button>
  );
}

export default PopoverTrigger;
