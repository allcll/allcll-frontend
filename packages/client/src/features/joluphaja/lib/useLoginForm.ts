import { FormEvent, useState } from 'react';
import loginValidator from './loginValidate';
import useInputs from '@/shared/lib/useInput';

type loginKeys = 'studentId' | 'password' | 'agreeToTerms';

/**
 * 로그인 폼의 상태와 동작을 관리하는 커스텀 훅입니다.
 * onChange, onBlur, submit 핸들러를 제공합니다.
 * @returns
 */
const useLoginForm = () => {
  const { values: loginValues, onChange: handleInputChange } = useInputs({
    studentId: '',
    password: '',
    agreeToTerms: false,
  });

  type LoginErrors = Partial<Record<loginKeys, string>>;

  const [errors, setErrors] = useState<LoginErrors>({});
  const [touched, setTouched] = useState<Record<loginKeys, boolean>>({
    studentId: false,
    password: false,
    agreeToTerms: false,
  });

  const onChange = (key: loginKeys, e: React.ChangeEvent<HTMLInputElement>) => {
    const { type, checked, value } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    handleInputChange(e);

    if (touched[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: loginValidator(key, inputValue),
      }));
    }
  };

  /**`
   *  입력 필드가 블러(포커스 아웃)될 때 호출되는 핸들러입니다.
   * @param key - 블러된 입력 필드의 이름입니다.
   */
  const onBlur = (key: loginKeys) => {
    setTouched(prev => ({ ...prev, [key]: true }));
    setErrors(prev => ({ ...prev, [key]: loginValidator(key, loginValues[key]) }));
  };

  const submit = (onSubmit: (data: typeof loginValues) => void) => (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextInputErrors = {
      studentId: loginValidator('studentId', loginValues.studentId),
      password: loginValidator('password', loginValues.password),
      agreeToTerms: loginValidator('agreeToTerms', loginValues.agreeToTerms),
    };

    setErrors(nextInputErrors);

    setTouched({
      studentId: true,
      password: true,
      agreeToTerms: true,
    });

    if (!Object.values(nextInputErrors).some(Boolean)) {
      onSubmit(loginValues);
    }
  };

  const isValid =
    !loginValidator('studentId', loginValues.studentId) &&
    !loginValidator('password', loginValues.password) &&
    !loginValidator('agreeToTerms', loginValues.agreeToTerms);

  return {
    values: loginValues,
    errors,
    touched,
    onChange,
    onBlur,
    submit,
    isValid,
  };
};

export default useLoginForm;
