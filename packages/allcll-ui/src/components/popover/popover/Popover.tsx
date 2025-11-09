import React, { createContext, useContext } from 'react';
import { usePopover } from '../usePopover';
import PopoverTrigger from '../popover-trigger/PopoverTrigger';
import PopoverContent from '../popover-content/PopoverContent';

export const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) throw new Error('Popover Component가 PopoverContext.Provider로 감싸져 있지 않습니다.');

  return context;
};

const PopoverContext = createContext<ReturnType<typeof usePopover> | null>(null);

export const PopoverRoot = ({ children }: { children: React.ReactNode }) => {
  const popover = usePopover();

  return <PopoverContext.Provider value={popover}>{children}</PopoverContext.Provider>;
};

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
});
