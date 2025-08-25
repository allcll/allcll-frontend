import { create } from 'zustand';
import { WishSearchParams } from '@/components/live/Searches.tsx';

interface IUseWishSearchStore {
  searchInput: string;
  selectedDepartment: string;
  isFavorite: boolean;
  isPinned: boolean;
  searchParams: WishSearchParams;
  setSearchInput: (searchInput: string) => void;
  setSelectedDepartment: (selectedDepartment: string) => void;
  setToggleFavorite: () => void;
  setTogglePinned: () => void;
  setSearchParams: (searchParams: WishSearchParams) => void;
}

/** @deprecated */
const useWishSearchStore = create<IUseWishSearchStore>(set => ({
  searchInput: '',
  selectedDepartment: '',
  isFavorite: false,
  isPinned: false,
  searchParams: { searchInput: '', selectedDepartment: '', isFavorite: false },
  setSearchInput: searchInput => set(() => ({ searchInput })),
  setSelectedDepartment: selectedDepartment => set(() => ({ selectedDepartment })),
  setToggleFavorite: () => set(state => ({ isFavorite: !state.isFavorite })),
  setTogglePinned: () => set(state => ({ isPinned: !state.isPinned })),
  setSearchParams: searchParams => set(() => ({ searchParams })),
}));

export default useWishSearchStore;
