import type { ReactNode } from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import Chip from '../../chip/Chip';
import { usePopoverContext } from '../popover/Popover';

interface IPopoverTrigger {
  label?: string;
  selected?: boolean;
  children?: ReactNode;
}

function PopoverTrigger({ label = '', selected, children }: IPopoverTrigger) {
  const { isOpen, triggerRef } = usePopoverContext();

  return (
    <RadixPopover.Trigger asChild ref={triggerRef}>
      {children ?? (
        <Chip type="button" label={label} isChipOpen={isOpen} variant="select" selected={selected ?? false} />
      )}
    </RadixPopover.Trigger>
  );
}

export default PopoverTrigger;
