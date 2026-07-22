import { useAdminSession, usePostAdminSession, usePostSsoLogin } from '@/hooks/server/session/useAdminSession';
import { useEffect, useState } from 'react';
import { Button, TextField, Grid, Flex, Card } from '@allcll/allcll-ui';
import SectionHeader from '../common/SectionHeader';

const initialTokens = {
  tokenJ: '',
  tokenU: '',
  tokenR: '',
  tokenL: '',
};

interface TokensType {
  tokenJ: string;
  tokenU: string;
  tokenR: string;
  tokenL: string;
  [key: string]: string;
}

const tokenType = ['tokenJ', 'tokenU', 'tokenR', 'tokenL'];

function AuthTokenSetting() {
  const userId = localStorage.getItem('userId') ?? '';
  const { data: serverTokens } = useAdminSession();

  const [tokens, setTokens] = useState<TokensType>(initialTokens);
  const [session, setSession] = useState<string>(localStorage.getItem('session') || '');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: postAdminSession } = usePostAdminSession();
  const { mutate: postSsoLogin, isPending: isSsoPending } = usePostSsoLogin();

  useEffect(() => {
    setTokens(
      serverTokens ?? {
        ...initialTokens,
        tokenU: userId ?? '',
      },
    );
  }, [serverTokens]);

  const handleTokenChange = (key: keyof TokensType, value: string) => {
    setTokens(prev => ({ ...prev, [key]: value }));
  };

  /** 어드민 인증 세션은 모든 요청의 인증 헤더로 쓰이므로 요청을 보내기 전에 저장한다. */
  const saveAdminSession = () => {
    localStorage.setItem('session', session);
  };

  const submitSsoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdminSession();
    postSsoLogin({ studentId, password }, { onSuccess: () => setPassword('') });
  };

  const submitTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    saveAdminSession();
    postAdminSession(tokens);
  };

  return (
    <Card>
      <SectionHeader title="인증정보 설정" description="크롤러에 필요한 인증 정보를 설정합니다." />

      <TextField
        id="adminSession"
        label="어드민 인증 세션"
        size="medium"
        value={session}
        placeholder="어드민 인증 세션 입력"
        onChange={e => setSession(e.target.value)}
      />

      <form onSubmit={submitSsoLogin} className="mt-5">
        <SectionHeader title="학번으로 설정" description="학번과 비밀번호를 입력하면 토큰을 자동으로 발급받습니다." />

        <Grid columns={{ base: 2 }} gap="gap-4" className="w-full">
          <TextField
            id="ssoStudentId"
            label="학번"
            size="medium"
            value={studentId}
            required
            placeholder="학번을 입력하세요"
            onChange={e => setStudentId(e.target.value)}
          />
          <TextField
            id="ssoPassword"
            label="비밀번호"
            type="password"
            size="medium"
            value={password}
            required
            placeholder="비밀번호를 입력하세요"
            onChange={e => setPassword(e.target.value)}
          />
        </Grid>

        <Flex justify="justify-end">
          <Button variant="primary" size="medium" type="submit" disabled={isSsoPending}>
            {isSsoPending ? '인증정보 발급 중...' : '인증정보 발급'}
          </Button>
        </Flex>
      </form>

      <form onSubmit={submitTokens} className="mt-5 border-t border-gray-200 pt-5">
        <SectionHeader
          title="토큰 직접 입력"
          description="학번으로 설정이 되지 않을 때 개발자도구에서 토큰을 복사해 입력합니다."
        />

        <Grid columns={{ base: 2 }} gap="gap-4" className="w-full">
          {tokenType.map(token => (
            <TextField
              key={token}
              id={token}
              label={token}
              size="medium"
              value={tokens[token]}
              required
              placeholder="토큰을 입력하세요"
              onChange={e => handleTokenChange(token, e.target.value)}
            />
          ))}
        </Grid>

        <Flex justify="justify-end">
          <Button variant="secondary" size="medium" type="submit">
            토큰 설정 요청
          </Button>
        </Flex>
      </form>
    </Card>
  );
}

export default AuthTokenSetting;
