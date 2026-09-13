import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type FeedbackStore = {
  dontShowAgain: boolean;
  setDontShowAgain: (v: boolean) => void;
  /**
   * 피드백 모달이 하나라도 열려 있는지 여부, FAB 모달과 졸업요건 결과 페이지 모달이 동시에 뜨지 않게 합니다.
   * dontShowAgain 과 달리 localStorage 에 저장하지 않아 새로고침하면 false 로 초기화됩니다. (partialize 참고)
   */
  isFeedbackOpen: boolean;
  setIsFeedbackOpen: (v: boolean) => void;
};

const STORAGE_KEY = 'checll_feedback_dont_show';

export const useFeedbackStore = create<FeedbackStore>()(
  persist(
    set => ({
      dontShowAgain: false,
      setDontShowAgain: v => set({ dontShowAgain: v }),
      isFeedbackOpen: false,
      setIsFeedbackOpen: v => set({ isFeedbackOpen: v }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ dontShowAgain: state.dontShowAgain }),
    },
  ),
);

export default useFeedbackStore;
