import { Button, Card, Checkbox, Flex, Heading, IconButton, SupportingText, TextField } from '@allcll/allcll-ui';
import { useState } from 'react';
import useLoginForm from '../lib/useLoginForm';
import useLoginConfirm from '../lib/useLoginConfirm';
import { useLogin } from '@/entities/user/model/useAuth';
import useToastNotification from '@/features/notification/model/useToastNotification';
import EyeOpenIcon from '@/assets/eye-gray.svg?react';
import EyeClosedIcon from '@/assets/eye-delete-gray.svg?react';
import LoginConfirmationDialog from './LoginConformDialog';

interface LoginFormProps {
  onSuccess?: () => void;
  onDepartmentNotFound?: () => void;
}

function isDepartmentNotFoundError(error: Error): boolean {
  try {
    const { message } = JSON.parse(error.message);
    return message === 'DEPARTMENT_NOT_FOUND';
  } catch {
    return false;
  }
}

function LoginForm({ onSuccess, onDepartmentNotFound }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { values, errors, touched, onChange, onBlur, submit, isValid, clearField } = useLoginForm();

  const { mutate: login, isPending } = useLogin();
  const addToast = useToastNotification(state => state.addToast);

  const { showConfirm, interceptSubmit, handleConfirm, handleClose } = useLoginConfirm({
    onLogin: data => login(data, { onSuccess: handleLoginSuccess, onError: handleLoginError }),
  });

  const handleLoginSuccess = () => {
    onSuccess?.();
    addToast('로그인에 성공하셨습니다.', 'login-success');
  };

  const handleLoginError = (error: Error) => {
    if (isDepartmentNotFoundError(error)) {
      onDepartmentNotFound?.();
      onSuccess?.();
      addToast('학과 정보를 찾을 수 없습니다. 다음 단계에서 직접 선택해주세요.', 'login-dept-not-found');
    } else {
      addToast('로그인에 실패했습니다. 학번과 비밀번호를 확인해주세요.', 'login-error');
    }
  };

  const getTextFieldProps = (name: 'studentId' | 'password') => ({
    name,
    id: name,
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(name, e),
    onBlur: () => onBlur(name),
    onClear: () => clearField(name),
    isError: touched[name] && !!errors[name],
    errorMessage: errors[name],
  });

  return (
    <>
      <Card variant="outlined" className="w-full  mx-auto p-8">
        <Flex justify="justify-center" direction="flex-col">
          <Heading level={2} size="xxl" className="mb-2 text-center">
            세종대 포털 로그인
          </Heading>
          <SupportingText className="mb-2 text-center">
            졸업 인증 정보를 불러오기 위해, 세종대 포털의 로그인이 필요합니다.
          </SupportingText>
        </Flex>

        <form onSubmit={submit(interceptSubmit)} className="flex flex-col gap-6">
          <TextField
            label="학번"
            size="medium"
            required
            placeholder="학번을 입력하세요"
            autoComplete="username"
            {...getTextFieldProps('studentId')}
          />
          <div className="relative">
            <TextField
              label="비밀번호"
              size="medium"
              required
              type={showPassword ? 'text' : 'password'}
              placeholder="세종대 포털 비밀번호를 입력하세요."
              autoComplete="current-password"
              {...getTextFieldProps('password')}
            />

            {values.password && (
              <IconButton
                type="button"
                onClick={() => setShowPassword(value => !value)}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                icon={!showPassword ? <EyeClosedIcon className="w-4 h-4" /> : <EyeOpenIcon className="w-4 h-4" />}
                className="absolute right-8 top-11"
              />
            )}
          </div>

          <Flex direction="flex-col" gap="gap-2">
            <SupportingText>
              ※ <span className="font-semibold text-primary">전과생, 연계전공, 편입생</span>은 현재 졸업 요건 판단이
              지원되지 않습니다.
              <br />※ <span className="font-semibold text-primary">비밀번호는 즉시 폐기</span>하며, 저장되지 않습니다.
              <br />※ ALLCLL 로그인 시
              <span className="font-semibold text-primary">학사정보시스템(세종대 포털)에서 로그아웃</span>됩니다.
            </SupportingText>
            <Flex
              direction="flex-col"
              align="items-start"
              justify="justify-between"
              className="sm:flex-row sm:items-center"
            >
              <Checkbox
                label="개인정보 수집에 동의합니다."
                name="agreeToTerms"
                checked={values.agreeToTerms}
                onChange={e => onChange('agreeToTerms', e)}
                onBlur={() => onBlur('agreeToTerms')}
              />

              <Button asChild variant="text" textColor="gray" size="small">
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                  자세히 보기
                </a>
              </Button>
            </Flex>
          </Flex>

          <Button type="submit" variant="primary" size="medium" disabled={!isValid || isPending}>
            {isPending ? '로그인 중...' : '로그인'}
          </Button>

          <LoginConfirmationDialog
            isOpen={showConfirm}
            onClose={handleClose}
            onConfirm={handleConfirm}
            isPending={isPending}
          />
        </form>
      </Card>
    </>
  );
}

export default LoginForm;
