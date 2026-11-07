import React, { createContext, useContext, useId, useRef, useState } from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import PopoverTrigger from '../popover-trigger/PopoverTrigger';
import PopoverContent from '../popover-content/PopoverContent';

export const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) throw new Error('Popover Component가 PopoverContext.Provider로 감싸져 있지 않습니다.');

  return context;
};

interface PopoverContextValue {
  id: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

export const PopoverRoot = ({ children }: { children: React.ReactNode }) => {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return (
    <PopoverContext.Provider value={{ id, isOpen, open, close, toggle, triggerRef }}>
      <RadixPopover.Root open={isOpen} onOpenChange={setIsOpen}>
        {children}
      </RadixPopover.Root>
    </PopoverContext.Provider>
  );
};

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
});
