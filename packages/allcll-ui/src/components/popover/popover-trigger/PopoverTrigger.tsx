import Chip from '../../chip/Chip';
import { usePopoverContext } from '../popover/Popover';

interface IPopoverTrigger {
  label: string;
  selected?: boolean;
}

function PopoverTrigger({ label, selected }: IPopoverTrigger) {
  const { isOpen, triggerRef, open, close } = usePopoverContext();

  const handleClick = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  return (
    <Chip
      type="button"
      label={label}
      isChipOpen={isOpen}
      variant="select"
      selected={selected ?? false}
      onClick={handleClick}
      containerRef={triggerRef}
    />
  );
}

export default PopoverTrigger;
