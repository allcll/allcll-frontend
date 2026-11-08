import { create } from 'zustand';

interface IUseAlarmSearchStore {
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
}

const useAlarmModalStore = create<IUseAlarmSearchStore>(set => ({
  isSearchOpen: false,
  setIsSearchOpen: isOpen => set(() => ({ isSearchOpen: isOpen })),
}));

export default useAlarmModalStore;
