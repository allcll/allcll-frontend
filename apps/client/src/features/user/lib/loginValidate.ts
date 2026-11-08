export interface LoginFormData {
  studentId: string;
  password: string;
  agreeToTerms: boolean;
}

const ERROR_MESSAGES = {
  NO_STUDENT_ID: '학번을 입력해주세요',
  INVALID_STUDENT_ID: '학번은 숫자만 입력 가능합니다',
  INVALID_STUDENT_ID_LENGTH: '학번은 8자리 숫자여야 합니다',
  NO_PASSWORD: '비밀번호를 입력해주세요',
  SHORT_PASSWORD: '비밀번호는 최소 4자 이상이어야 합니다',
  NO_AGREE_TO_TERMS: '개인정보 수집에 동의해주세요',
} as const;

const loginValidator = <K extends keyof LoginFormData>(key: K, value: LoginFormData[K]): string | undefined => {
  switch (key) {
    case 'studentId': {
      const studentIdValue = value as string;
      if (!studentIdValue.trim()) {
        return ERROR_MESSAGES.NO_STUDENT_ID;
      }
      if (!/^\d+$/.test(studentIdValue)) {
        return ERROR_MESSAGES.INVALID_STUDENT_ID;
      }
      if (studentIdValue.length !== 8) {
        return ERROR_MESSAGES.INVALID_STUDENT_ID_LENGTH;
      }
      return undefined;
    }

    case 'password': {
      const passwordValue = value as string;
      if (!passwordValue.trim()) {
        return ERROR_MESSAGES.NO_PASSWORD;
      }
      if (passwordValue.length < 4) {
        return ERROR_MESSAGES.SHORT_PASSWORD;
      }
      return undefined;
    }

    case 'agreeToTerms': {
      const agreeToTermsValue = value as boolean;
      if (!agreeToTermsValue) {
        return ERROR_MESSAGES.NO_AGREE_TO_TERMS;
      }
      return undefined;
    }

    default:
      return undefined;
  }
};

export default loginValidator;
