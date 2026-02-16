import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { fetchGraduationCheck } from '@/entities/graduation/api/graduation';
import { graduationQueryKeys } from '@/entities/graduation/model/useGraduation';
import { useInitialGraduationCheck } from './useInitialCheck';
import { JolupSteps, useJolupStore } from '../model/useJolupStore';

export { JolupSteps };

/**
 * 스텝의 side effect를 관리하는 훅
 * ex) 로그인 정보가 있으면, 어디 스탭으로 이동하고 등등
 */
function useJolupSteps() {
  const { step, setStep, isDepartmentNotFound, setIsDepartmentNotFound } = useJolupStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const isRetry = searchParams.get('retry') === 'true';
  const skipInfo = searchParams.get('skipInfo') === 'true';

  const { initialStep, isLoading } = useInitialGraduationCheck(isRetry, skipInfo);

  // 초기 스텝 설정
  useEffect(() => {
    if (isLoading || !initialStep) return;

    if (initialStep === JolupSteps.RESULT) {
      setStep(JolupSteps.RESULT);
      navigate('/graduation/result');
    } else {
      setStep(initialStep);
    }
  }, [initialStep, isLoading, navigate, setStep]);

  // 로그인 후 이전 결과 확인
  const checkAfterLogin = useCallback(async () => {
    try {
      const data = await fetchGraduationCheck();
      if (data && !isRetry) {
        queryClient.setQueryData(graduationQueryKeys.check(), data);
        setStep(JolupSteps.RESULT);
        navigate('/graduation/result');
        return;
      }
    } catch {
      // 결과 없음 — 정상적으로 다음 스텝 진행
    }
    setStep(JolupSteps.DEPARTMENT_INFO);
  }, [isRetry, navigate, queryClient, setStep]);

  /**
   * 검사 스텝을 다음 단계로 이동합니다.
   * */
  function nextStep() {
    switch (step) {
      case JolupSteps.LOGIN:
        checkAfterLogin().then();
        break;
      case JolupSteps.DEPARTMENT_INFO:
        setStep(JolupSteps.FILE_UPLOAD);
        break;
      case JolupSteps.FILE_UPLOAD:
        setStep(JolupSteps.UPLOADING);
        break;
      case JolupSteps.UPLOADING:
        setStep(JolupSteps.RESULT);
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

  return { step, nextStep, prevStep, setStep, isLoading, isDepartmentNotFound, setIsDepartmentNotFound };
}
export default useJolupSteps;
