import { create } from 'zustand';

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

export const useJolupStore = create<JolupState>(set => ({
  step: JolupSteps.LOGIN,
  isDepartmentNotFound: false,
  setStep: step => {
    set({ step });
  },
  setIsDepartmentNotFound: isDepartmentNotFound => set({ isDepartmentNotFound }),
  reset: () => set({ step: JolupSteps.LOGIN, isDepartmentNotFound: false }),
}));
