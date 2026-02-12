// LocalStorage key
const STORAGE_KEY = 'mock-graduation-state';

export type UserType = 'SINGLE' | 'DOUBLE' | 'TRANSFER';
export type GraduationStep = 'NO_FILE' | 'PROCESSING' | 'DONE';

export interface GraduationState {
  isAuthenticated: boolean;
  userType: UserType;
  graduationStep: GraduationStep;
}

const defaultState: GraduationState = {
  isAuthenticated: true, // 개발 편의를 위해 기본값은 로그인 상태
  userType: 'SINGLE',
  graduationStep: 'NO_FILE',
};

export const getGraduationState = (): GraduationState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultState;
  } catch (e) {
    return defaultState;
  }
};

export const setGraduationState = (newState: Partial<GraduationState>) => {
  const current = getGraduationState();
  const updated = { ...current, ...newState };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const resetGraduationState = () => {
  localStorage.removeItem(STORAGE_KEY);
  return defaultState;
};
