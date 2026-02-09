import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useInitialGraduationCheck } from './useInitialCheck';

export enum JolupSteps {
  LOGIN = 'LOGIN',
  DEPARTMENT_INFO = 'DEPARTMENT_INFO',
  FILE_UPLOAD = 'FILE_UPLOAD',
  UPLOADING = 'UPLOADING',
  RESULT = 'RESULT',
}

/**
 * 스텝의 side effect를 관리하는 훅
 * ex) 로그인 정보가 있으면, 어디 스탭으로 이동하고 등등
 */
function useJolupSteps() {
  const [step, setStep] = useState<JolupSteps>(JolupSteps.LOGIN);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRetry = searchParams.get('retry') === 'true';

  const { initialStep, isLoading } = useInitialGraduationCheck(isRetry);

  // 초기 스텝 설정
  useEffect(() => {
    if (isLoading || !initialStep) return;

    if (initialStep === JolupSteps.RESULT) {
      navigate('/graduation/result');
    } else {
      setStep(initialStep);
    }
  }, [initialStep, isLoading, navigate]);

  /**
   * 검사 스텝을 다음 단계로 이동합니다.
   * */
  function nextStep() {
    switch (step) {
      case JolupSteps.LOGIN:
        setStep(JolupSteps.DEPARTMENT_INFO);
        break;
      case JolupSteps.DEPARTMENT_INFO:
        setStep(JolupSteps.FILE_UPLOAD);
        break;
      case JolupSteps.FILE_UPLOAD:
        setStep(JolupSteps.UPLOADING);
        break;
      case JolupSteps.UPLOADING:
        navigate('/graduation/result');
        break;
      default:
        console.error(`Unknown step ${step}`);
        break;
    }
  }

  function prevStep() {
    switch (step) {
      case JolupSteps.DEPARTMENT_INFO:
        setStep(JolupSteps.LOGIN);
        break;
      case JolupSteps.FILE_UPLOAD:
        setStep(JolupSteps.DEPARTMENT_INFO);
        break;
      case JolupSteps.UPLOADING:
        setStep(JolupSteps.FILE_UPLOAD);
        break;
      case JolupSteps.LOGIN:
        // First step, do nothing
        break;
      default:
        console.error(`Unknown step ${step}`);
        break;
    }
  }

  return { step, nextStep, prevStep, setStep, isLoading };
}
export default useJolupSteps;
