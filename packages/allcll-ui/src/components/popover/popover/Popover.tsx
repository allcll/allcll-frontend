import React, { createContext, useContext, useId, useRef } from 'react';
import PopoverTrigger from '../popover-trigger/PopoverTrigger';
import PopoverContent from '../popover-content/PopoverContent';
import { usePopoverGroup } from './PopoverGroup';

/**
 * - PopoverGroup의 openId를 받아 이 Popover의 isOpen을 계산합니다.
 * - usePopoverGroup은 PopoverRoot에서만 사용합니다.
 * - Trigger / Content는 상태를 직접 제어하지 않습니다.
 */
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
  const { openId, setOpenId } = usePopoverGroup();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const isOpen = openId === id;

  const open = () => setOpenId(id);
  const close = () => setOpenId(null);
  const toggle = () => setOpenId(isOpen ? null : id);

  return (
    <PopoverContext.Provider value={{ id, isOpen: openId === id, open, close, toggle, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
};

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
});
