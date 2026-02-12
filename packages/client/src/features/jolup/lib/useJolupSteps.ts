import { useState } from 'react';

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
  const [isDepartmentNotFound, setIsDepartmentNotFound] = useState(false);

  // useEffect(() => {
  //   setStep(step => {
  //     // 여기에 side effect 로직을 추가하세요.
  //     return step;
  //   });
  // }, []);

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
        // Todo: 마지막 단계 처리 (예: 결과 페이지로 이동)
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

  return { step, nextStep, prevStep, isDepartmentNotFound, setIsDepartmentNotFound };
}
export default useJolupSteps;
