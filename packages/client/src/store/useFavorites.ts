import {create} from 'zustand';

interface FavoritesState {
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  toggleFavorite: (id: number) => {
    const isFavorite = get().favorites.includes(id);

    set((state) => {
      const newFavorites = isFavorite ? state.favorites.filter(favId => favId !== id) : [...state.favorites, id];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    });
  },
  isFavorite: (id: number) => get().favorites.includes(id),
}));

export default useFavoritesStore;