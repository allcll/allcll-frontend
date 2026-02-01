export interface LoginFormData {
  studentId: string;
  password: string;
  agreeToTerms: boolean;
}

const NO_STUDENT_ID = '학번을 입력해주세요';
const INVALID_STUDENT_ID = '학번은 숫자만 입력 가능합니다';
const INVALID_STUDENT_ID_LENGTH = '학번은 8자리 숫자여야 합니다';
const NO_PASSWORD = '비밀번호를 입력해주세요';
const SHORT_PASSWORD = '비밀번호는 최소 4자 이상이어야 합니다';
const NO_AGREE_TO_TERMS = '개인정보 수집에 동의해주세요';

const loginValidator = <K extends keyof LoginFormData>(key: K, value: LoginFormData[K]): string | undefined => {
  switch (key) {
    case 'studentId': {
      const studentIdValue = value as string;
      if (!studentIdValue.trim()) {
        return NO_STUDENT_ID;
      }
      if (!/^\d+$/.test(studentIdValue)) {
        return INVALID_STUDENT_ID;
      }
      if (studentIdValue.length !== 8) {
        return INVALID_STUDENT_ID_LENGTH;
      }
      return undefined;
    }

    case 'password': {
      const passwordValue = value as string;
      if (!passwordValue.trim()) {
        return NO_PASSWORD;
      }
      if (passwordValue.length < 4) {
        return SHORT_PASSWORD;
      }
      return undefined;
    }

    case 'agreeToTerms': {
      const agreeToTermsValue = value as boolean;
      if (!agreeToTermsValue) {
        return NO_AGREE_TO_TERMS;
      }
      return undefined;
    }

    default:
      return undefined;
  }
};

export default loginValidator;
