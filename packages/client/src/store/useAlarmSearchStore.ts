import { create } from 'zustand';

interface IUseAlarmSearchStore {
  searchKeyword: string;
  isAlarmWish: boolean;
  setSearchKeyword: (searchKeyword: string) => void;
  toggleAlarmWish: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
}

/** @deprecated */
const useAlarmSearchStore = create<IUseAlarmSearchStore>(set => ({
  searchKeyword: '',
  isAlarmWish: false,
  isSearchOpen: false,
  selectedDepartment: '',
  setSearchKeyword: searchKeyword => set(() => ({ searchKeyword })),
  toggleAlarmWish: () => set(state => ({ isAlarmWish: !state.isAlarmWish })),
  setIsSearchOpen: isOpen => set(() => ({ isSearchOpen: isOpen })),
  setSelectedDepartment: department => set(() => ({ selectedDepartment: department })),
}));

export default useAlarmSearchStore;
