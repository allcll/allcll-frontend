import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type FeedbackStore = {
  dontShowAgain: boolean;
  setDontShowAgain: (v: boolean) => void;
};

const STORAGE_KEY = 'checll_feedback_dont_show';

export const useFeedbackStore = create<FeedbackStore>()(
  persist(
    set => ({
      dontShowAgain: false,
      setDontShowAgain: v => set({ dontShowAgain: v }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ dontShowAgain: state.dontShowAgain }),
    }
  )
);

export default useFeedbackStore;
