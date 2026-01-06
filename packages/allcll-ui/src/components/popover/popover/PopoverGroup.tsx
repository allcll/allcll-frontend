import { createContext, useContext, useState } from 'react';

interface PopoverGroupContextValue {
  openId: string | null;
  setOpenId: (id: string | null) => void;
}

const PopoverGroupContext = createContext<PopoverGroupContextValue | null>(null);

export function PopoverGroup({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return <PopoverGroupContext.Provider value={{ openId, setOpenId }}>{children}</PopoverGroupContext.Provider>;
}

/**
 * 최상위에서 PopoverGroupContext를 사용하기 위한 커스텀 훅입니다.
 * @returns
 */
export function usePopoverGroup() {
  const context = useContext(PopoverGroupContext);
  if (!context) {
    throw new Error('PopoverGroup 컴포넌트가 PopoverGroupContext.Provider로 감싸져 있지 않습니다.');
  }
  return context;
}
