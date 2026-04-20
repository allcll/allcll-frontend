/**
 * 각 기능은 이 인터페이스를 참조하면 좋겠습니다. */
export interface JolupStepsProps {
  nextStep: () => void;
  prevStep: () => void;
}
