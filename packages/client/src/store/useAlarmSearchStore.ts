import { create } from 'zustand';

interface IUseAlarmSearchStore {
  searchKeyword: string;
  isAlarmWish: boolean;
  setSearchKeyword: (searchKeyword: string) => void;
  toggleAlarmWish: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
}

const useAlarmSearchStore = create<IUseAlarmSearchStore>(set => ({
  searchKeyword: '',
  isAlarmWish: false,
  isSearchOpen: false,
  setSearchKeyword: searchKeyword => set(() => ({ searchKeyword })),
  toggleAlarmWish: () => set(state => ({ isAlarmWish: !state.isAlarmWish })),
  setIsSearchOpen: isOpen => set(() => ({ isSearchOpen: isOpen })),
}));

export default useAlarmSearchStore;
