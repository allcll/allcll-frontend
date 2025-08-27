import { create } from 'zustand';

interface INotificationPermission {
  isOpen: boolean;
  isPermitted: boolean;
  open: () => void;
  close: () => void;
  setPermitted: (permitted: boolean) => void;
}

const useNotificationInstruction = create<INotificationPermission>(set => ({
  isOpen: false,
  isPermitted: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setPermitted: (permitted: boolean) => set({ isPermitted: permitted }),
}));

export default useNotificationInstruction;
