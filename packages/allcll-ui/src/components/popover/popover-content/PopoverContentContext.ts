import { createContext, useContext } from 'react';

export const PopoverContentContext = createContext(false);

// 같은 필터 내용이 팝오버, 모달, 바텀시트에 그대로 쓰여서, 팝오버 안에서만 라벨을 캡션으로 줄이기 위해 사용함
export const useIsInPopoverContent = () => useContext(PopoverContentContext);
