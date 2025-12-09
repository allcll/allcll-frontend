import { useAdminSession, usePostAdminSession } from '@/hooks/server/session/useAdminSession';
import Card from '@allcll/common/components/Card';
import { useEffect, useState } from 'react';
import { Button, TextField } from '@allcll/allcll-ui';

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

interface ITokenSetting {
  setIsSessionSet?: React.Dispatch<React.SetStateAction<boolean>>;
}

function AuthTokenSetting({}: ITokenSetting) {
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
      <h3 className="text-md font-semibold">인증 정보를 먼저 설정해주세요.</h3>
      <span className="text-sm text-gray-500">크롤러가 사용할 인증 토큰과 키를 설정합니다.</span>

      <form onSubmit={submitTokens}>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
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
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <TextField
            id="adminSession"
            label="어드민 인증 세션"
            size="medium"
            required={true}
            value={session}
            placeholder="어드민 인증 세션 입력"
            onChange={e => setSession(e.target.value)}
          />

          <div className="flex justify-end">
            <Button variant="primary" size="medium" type="submit">
              토큰 설정 요청
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}

export default AuthTokenSetting;
