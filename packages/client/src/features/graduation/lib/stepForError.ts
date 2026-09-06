import { ApiError } from '@/shared/lib/errors.ts';
import { JolupSteps } from '../model/useJolupStore';

/**
 * 에러 코드로 진입 스텝을 정합니다.
 * 모르는 에러는 로그인부터 다시 하게 둡니다.
 */
export function stepForError(error: Error): JolupSteps {
  if (!(error instanceof ApiError)) return JolupSteps.LOGIN;

  switch (error.code) {
    case 'DEPARTMENT_NOT_FOUND':
      return JolupSteps.DEPARTMENT_INFO;
    case 'GRADUATION_CHECK_NOT_FOUND':
      // 문자열 분기 시절의 동작을 그대로 옮긴 것입니다. 기본 정보부터 받는 게 맞는지 확인이 필요합니다.
      return JolupSteps.FILE_UPLOAD;
    default:
      // SESSION_NOT_FOUND, SESSION_EXPIRED 가 여기로 옵니다.
      return JolupSteps.LOGIN;
  }
}

export default stepForError;
