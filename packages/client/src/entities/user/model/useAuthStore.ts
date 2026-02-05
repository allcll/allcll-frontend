import { create } from 'zustand';
import { UserResponse } from './types';

interface AuthStore {
  user: UserResponse | null;
  setUser: (user: UserResponse) => void;
  clearUser: () => void;
}

const useAuthStore = create<AuthStore>(set => ({
  user: null,
  setUser: (user: UserResponse) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useAuthStore;
