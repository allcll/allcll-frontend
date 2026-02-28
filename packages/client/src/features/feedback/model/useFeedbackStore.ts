import { create } from 'zustand';

type FeedbackStore = {
  dontShowAgain: boolean;
  setDontShowAgain: (v: boolean) => void;
};

const STORAGE_KEY = 'checll_feedback_dont_show';

export const useFeedbackStore = create<FeedbackStore>(set => ({
  dontShowAgain: (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw === 'true';
    } catch (e) {
      return false;
    }
  })(),

  setDontShowAgain: v => {
    try {
      localStorage.setItem(STORAGE_KEY, v ? 'true' : 'false');
    } catch (e) {
      // ignore
    }
    set({ dontShowAgain: v });
  },
}));

export default useFeedbackStore;
