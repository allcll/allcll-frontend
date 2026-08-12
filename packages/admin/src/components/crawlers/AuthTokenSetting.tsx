import { useAdminSession, usePostAdminSession } from '@/hooks/server/session/useAdminSession';
import { useEffect, useState } from 'react';
import { Button, TextField, Grid, Flex, Card } from '@allcll/allcll-ui';
import SectionHeader from '../common/SectionHeader';
import { TOKEN_FIELDS } from '@/utils/type';

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

function AuthTokenSetting() {
  const userId = localStorage.getItem('userId') ?? '';
  const { data: serverTokens } = useAdminSession();

  const [tokens, setTokens] = useState<TokensType>(initialTokens);
  const [session, setSession] = useState<string>(localStorage.getItem('session') || '');
  const { mutate: postAdminSession } = usePostAdminSession();

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

  const submitTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    postAdminSession(tokens);
    localStorage.setItem('session', session);
  };

  return (
    <Card>
      <SectionHeader title="인증정보 설정" description="크롤러에 필요한 인증 정보를 설정합니다." />

      <form onSubmit={submitTokens}>
        <Grid columns={{ base: 2 }} gap="gap-4" className="w-full">
          {TOKEN_FIELDS.map(({ key, label }) => (
            <TextField
              key={key}
              id={key}
              label={label}
              size="medium"
              value={tokens[key]}
              required
              placeholder="토큰을 입력하세요"
              onChange={e => handleTokenChange(key, e.target.value)}
            />
          ))}

          <TextField
            id="adminSession"
            label="어드민 인증 세션"
            size="medium"
            required={true}
            value={session}
            placeholder="어드민 인증 세션 입력"
            onChange={e => setSession(e.target.value)}
          />
        </Grid>

        <Flex justify="justify-end">
          <Button variant="primary" size="medium" type="submit">
            토큰 설정 요청
          </Button>
        </Flex>
      </form>
    </Card>
  );
}

export default AuthTokenSetting;
