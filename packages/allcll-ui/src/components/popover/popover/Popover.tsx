import { useRef, useState, type ReactNode } from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import PopoverTrigger from '../popover-trigger/PopoverTrigger';
import PopoverContent from '../popover-content/PopoverContent';
import { PopoverContext } from './PopoverContext';

interface PopoverProps {
  children: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const PopoverRoot = ({ children, isOpen: controlledOpen, onOpenChange }: PopoverProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = controlledOpen ?? uncontrolledOpen;

  const setOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <PopoverContext.Provider value={{ isOpen, triggerRef }}>
      <RadixPopover.Root open={isOpen} onOpenChange={setOpen}>
        {children}
      </RadixPopover.Root>
    </PopoverContext.Provider>
  );
};

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: RadixPopover.Close,
});
