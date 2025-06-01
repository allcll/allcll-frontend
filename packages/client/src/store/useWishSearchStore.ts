import { create } from 'zustand';
import { WishSearchParams } from '@/components/dashboard/Searches.tsx';

interface IUseWishSearchStore {
  searchInput: string;
  selectedDepartment: string;
  isFavorite: boolean;
  searchParams: WishSearchParams;
  setSearchInput: (searchInput: string) => void;
  setSelectedDepartment: (selectedDepartment: string) => void;
  setToggleFavorite: () => void;
  setSearchParams: (searchParams: WishSearchParams) => void;
}

const useWishSearchStore = create<IUseWishSearchStore>(set => ({
  searchInput: '',
  selectedDepartment: '',
  isFavorite: false,
  searchParams: { searchInput: '', selectedDepartment: '', isFavorite: false },
  setSearchInput: searchInput => set(() => ({ searchInput })),
  setSelectedDepartment: selectedDepartment => set(() => ({ selectedDepartment })),
  setToggleFavorite: () => set(state => ({ isFavorite: !state.isFavorite })),
  setSearchParams: searchParams => set(() => ({ searchParams })),
}));

export default useWishSearchStore;
