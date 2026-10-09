import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const TUTORIAL_STORAGE_KEY = 'visitedTutorial';
const DAYS = 24 * 60 * 60 * 1000;
const SEVEN_DAYS_IN_MS = 7 * DAYS;

interface TutorialState {
  visitedAt: number | null; // 튜토리얼을 본 시점의 타임스탬프
  shouldSkipTutorial: boolean;
  setVisited: () => void;
  resetVisited: () => void;
}

const useTutorialStore = create<TutorialState>()(
  persist(
    set => ({
      visitedAt: null,
      shouldSkipTutorial: false,
      setVisited: () => set({ visitedAt: Date.now(), shouldSkipTutorial: true }),
      resetVisited: () => set({ visitedAt: null, shouldSkipTutorial: false }),
    }),
    {
      name: TUTORIAL_STORAGE_KEY, // localStorage에 저장될 키
      storage: createJSONStorage(() => localStorage), // 사용할 스토리지
      // 스토리지에서 상태를 불러올 때(rehydrate) 실행되는 로직
      onRehydrateStorage: () => state => {
        if (state) {
          const now = Date.now();
          const isExpired = !state.visitedAt || now - state.visitedAt > SEVEN_DAYS_IN_MS;

          if (isExpired) {
            // 만료되었다면 상태를 리셋
            state.resetVisited();
          } else {
            // 만료되지 않았다면 isVisited를 true로 유지
            state.shouldSkipTutorial = true;
          }
        }
      },
    },
  ),
);

export default useTutorialStore;
