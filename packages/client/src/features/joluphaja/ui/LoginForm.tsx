import { Link } from 'react-router-dom';

import { Button, Checkbox, Flex, TextField } from '@allcll/allcll-ui';
import useLoginForm from '../lib/useLoginForm';

interface LoginFormProps {
  onSubmit: (data: { studentId: string; password: string; agreeToTerms: boolean }) => void;
}

function LoginForm({ onSubmit }: LoginFormProps) {
  const { values, errors, touched, onChange, onBlur, submit, isValid } = useLoginForm();

  return (
    <form onSubmit={submit(onSubmit)} className="flex flex-col gap-6">
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

      <Button type="submit" variant="primary" size="medium" disabled={!isValid}>
        로그인
      </Button>
    </form>
  );
}

export default LoginForm;
