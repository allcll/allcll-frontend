import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

interface TutorialStoreState {
  lastHiddenAt: string | null;
  actions: {
    hideTutorialForAWeek: () => void;
    showTutorialAgain: () => void;
  };
}

const useTutorialStore = create<TutorialStoreState>()(
  persist(
    set => ({
      lastHiddenAt: null,
      actions: {
        hideTutorialForAWeek: () => set({ lastHiddenAt: new Date().toISOString() }),
        showTutorialAgain: () => set({ lastHiddenAt: null }),
      },
    }),
    {
      name: 'visitedTutorial', // 기존 localStorage 키 이름 사용
      partialize: state => ({ lastHiddenAt: state.lastHiddenAt }),
    },
  ),
);

export const useTutorial = () => {
  const { lastHiddenAt, actions } = useTutorialStore();
  const { hideTutorialForAWeek, showTutorialAgain } = actions;

  const isTutorialRequired = (() => {
    if (!lastHiddenAt) return true;

    const hiddenDate = new Date(lastHiddenAt);
    const now = new Date();
    const timeDifference = now.getTime() - hiddenDate.getTime();
    return timeDifference >= SEVEN_DAYS_IN_MS;
  })();

  return {
    isTutorialRequired,
    hideTutorialForAWeek,
    showTutorialAgain,
  };
};
