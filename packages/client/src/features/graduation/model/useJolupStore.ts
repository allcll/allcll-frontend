import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export enum JolupSteps {
  LOGIN = 'LOGIN',
  DEPARTMENT_INFO = 'DEPARTMENT_INFO',
  FILE_UPLOAD = 'FILE_UPLOAD',
  UPLOADING = 'UPLOADING',
  RESULT = 'RESULT',
}

interface JolupState {
  step: JolupSteps;
  isDepartmentNotFound: boolean;
  setStep: (step: JolupSteps) => void;
  setIsDepartmentNotFound: (isNotFound: boolean) => void;
  reset: () => void;
}

export const useJolupStore = create<JolupState>()(
  persist(
    set => ({
      step: JolupSteps.LOGIN,
      isDepartmentNotFound: false,
      setStep: step => {
        set({ step });
      },
      setIsDepartmentNotFound: isDepartmentNotFound => set({ isDepartmentNotFound }),
      reset: () => set({ step: JolupSteps.LOGIN, isDepartmentNotFound: false }),
    }),
    {
      name: 'jolup-step',
      storage: createJSONStorage(() => sessionStorage),
      partialize: state => ({ step: state.step }),
    },
  ),
);
