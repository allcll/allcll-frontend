import { createContext, useContext, type RefObject } from 'react';

interface PopoverContextValue {
  isOpen: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export const PopoverContext = createContext<PopoverContextValue | null>(null);

export const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) throw new Error('Popover Component가 PopoverContext.Provider로 감싸져 있지 않습니다.');

  return context;
};
