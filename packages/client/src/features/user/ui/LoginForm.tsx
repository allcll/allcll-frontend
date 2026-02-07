import { Link } from 'react-router-dom';
import useToastNotification from '@/features/notification/model/useToastNotification';
import { Button, Card, Checkbox, Flex, Heading, SupportingText, TextField } from '@allcll/allcll-ui';
import useLoginForm from '../lib/useLoginForm';
import { useLogin } from '@/entities/user/model/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
}

function LoginForm({ onSuccess }: LoginFormProps) {
  const { values, errors, touched, onChange, onBlur, submit, isValid } = useLoginForm();
  const { mutate: login, isPending } = useLogin();
  const showToast = useToastNotification.getState().addToast;

  const handleSubmit = (data: { studentId: string; password: string }) => {
    login(
      { studentId: data.studentId, password: data.password },
      {
        onSuccess: () => {
          onSuccess?.();
          showToast('로그인에 성공했습니다. 졸업 요건 검사를 시작합니다.');
        },
        onError: () => {
          //nextStep으로 넘어가기 위해서 임의로 추가
          onSuccess?.();

          // 로그인 실패 시 처리 (예: 에러 메시지 표시)
          showToast('로그인에 실패했습니다. 학번과 비밀번호를 확인해주세요.');
        },
      },
    );
  };

  return (
    <Card variant="outlined" className="w-full  mx-auto p-8">
      <Heading level={2} size="xxl" className="mb-6 text-center">
        학사 정보 로그인
      </Heading>
      <SupportingText className="mb-6 text-center">
        졸업 인증 정보를 불러오기 위해, 학사 정보 시스템의 로그인이 필요합니다. <br /> 비밀번호는 즉시 폐기하며,
        저장되지 않습니다.
      </SupportingText>
      <form onSubmit={submit(handleSubmit)} className="flex flex-col gap-6">
        <TextField
          label="학번"
          name="studentId"
          id="studentId"
          size="medium"
          value={values.studentId}
          onChange={e => onChange('studentId', e)}
          onBlur={() => onBlur('studentId')}
          isError={touched.studentId && !!errors.studentId}
          errorMessage={errors.studentId}
          required
          placeholder="학번을 입력하세요"
        />

        <TextField
          label="비밀번호"
          name="password"
          id="password"
          type="password"
          size="medium"
          value={values.password}
          onChange={e => onChange('password', e)}
          onBlur={() => onBlur('password')}
          isError={touched.password && !!errors.password}
          errorMessage={errors.password}
          required
          placeholder="비밀번호를 입력하세요"
        />

        <Flex direction="flex-col" gap="gap-2">
          <Flex align="items-center" gap="gap-2">
            <Checkbox
              label="개인정보 수집에 동의합니다."
              name="agreeToTerms"
              checked={values.agreeToTerms}
              onChange={e => onChange('agreeToTerms', e)}
              onBlur={() => onBlur('agreeToTerms')}
            />

            <Button asChild variant="text" textColor="primary" size="small">
              <Link to="/privacy-policy">자세히 보기</Link>
            </Button>
          </Flex>
        </Flex>

        <Button type="submit" variant="primary" size="medium" disabled={!isValid || isPending}>
          {isPending ? '로그인 중...' : '로그인'}
        </Button>
      </form>
    </Card>
  );
}

export default LoginForm;
