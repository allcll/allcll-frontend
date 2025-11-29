import Chip from '@/components/chip/Chip';
import { usePopoverContext } from '../popover/Popover';

function PopoverTrigger({ label }: { label: string }) {
  const { open, close, isOpen, triggerRef } = usePopoverContext();

  return (
    <Chip
      label={label}
      isChipOpen={isOpen}
      variant="select"
      selected={isOpen}
      onClick={isOpen ? close : open}
      containerRef={triggerRef}
    />
  );
}

export default PopoverTrigger;
