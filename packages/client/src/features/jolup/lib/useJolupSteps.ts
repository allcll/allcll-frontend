import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useInitialGraduationCheck } from './useInitialCheck';

export enum JolupSteps {
  LOGIN = 'LOGIN',
  BASIC_INFO = 'BASIC_INFO',
  FILE_UPLOAD = 'FILE_UPLOAD',
  UPLOADING = 'UPLOADING',
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
  const isRouteDefined = useRef(false);

  // 초기 진입 판단용 훅 사용 (retry: false)
  const graduationCheckQuery = useInitialGraduationCheck();

  useEffect(() => {
    if (graduationCheckQuery.isLoading || !isRouteDefined.current) return;
    isRouteDefined.current = true;

    // 2. 졸업 요건 검사 데이터 체크 (에러 분기 처리)
    if (graduationCheckQuery.isError) {
      const error = graduationCheckQuery.error as Error;
      const message = error.message;

      // TODO: 서버 에러 메시지에 맞춰 조건문 수정 필요
      if (message.includes('401') || message.includes('Unauthorized')) {
        // 로그인이 안 된 경우
        setStep(JolupSteps.LOGIN);
      } else if (message.includes('학과') || message.includes('Major') || message.includes('기본 정보')) {
        // 학과 선택 등 기본 정보가 없는 경우
        setStep(JolupSteps.BASIC_INFO);
      } else {
        // 그 외 에러 (예: 404 Not Found - 결과 없음) -> 파일 업로드 필요
        setStep(JolupSteps.FILE_UPLOAD);
      }
      return;
    }

    // 성공 시 처리
    if (graduationCheckQuery.data?.data) {
      if (isRetry) {
        setStep(JolupSteps.BASIC_INFO);
      } else {
        navigate('/graduation/result');
      }
    }
  }, [
    graduationCheckQuery.isLoading,
    graduationCheckQuery.isError,
    graduationCheckQuery.error,
    graduationCheckQuery.data,
    isRetry,
  ]);

  /**
   * 검사 스텝을 다음 단계로 이동합니다.
   * */
  function nextStep() {
    switch (step) {
      case JolupSteps.LOGIN:
        setStep(JolupSteps.BASIC_INFO);
        break;
      case JolupSteps.BASIC_INFO:
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
      case JolupSteps.BASIC_INFO:
        setStep(JolupSteps.LOGIN);
        break;
      case JolupSteps.FILE_UPLOAD:
        setStep(JolupSteps.BASIC_INFO);
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

  return { step, nextStep, prevStep };
}
export default useJolupSteps;
