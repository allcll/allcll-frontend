import { create } from 'zustand';

interface IUseAlarmSearchStore {
  searchKeyword: string;
  isAlarmWish: boolean;
  setSearchKeyword: (searchKeyword: string) => void;
  toggleAlarmWish: () => void;
}

const useAlarmSearchStore = create<IUseAlarmSearchStore>(set => ({
  searchKeyword: '',
  isAlarmWish: false,
  setSearchKeyword: searchKeyword => set(() => ({ searchKeyword })),
  toggleAlarmWish: () => set(state => ({ isAlarmWish: !state.isAlarmWish })),
}));

export default useAlarmSearchStore;
