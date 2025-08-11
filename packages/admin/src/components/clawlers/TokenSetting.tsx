import { usePostAdminSession } from '@/hooks/server/session/useAdminSession';
import Card from '@allcll/common/components/Card';
import { useState } from 'react';

const initialTokens = {
  tokenJ: '',
  tokenU: '',
  tokenR: '',
  tokenL: '',
};

interface tokensType {
  tokenJ: string;
  tokenU: string;
  tokenR: string;
  tokenL: string;
  [key: string]: string;
}

const tokenType = ['tokenJ', 'tokenU', 'tokenR', 'tokenL'];

function TokenSetting() {
  const [tokens, setTokens] = useState<tokensType>(initialTokens);
  const [session, setSession] = useState<string>('');
  const { mutate: postAdminSession } = usePostAdminSession();

  const handleTokenChange = (key: keyof tokensType, value: string) => {
    setTokens(prev => ({ ...prev, [key]: value }));
  };

  const submitTokens = (e: React.FormEvent) => {
    e.preventDefault();
    postAdminSession(tokens);
    localStorage.setItem('session', session);
  };

  return (
    <Card>
      <h3 className="text-md font-semibold mb-3">인증 정보 설정</h3>
      <form onSubmit={submitTokens}>
        <div className="grid md:grid-cols-2 gap-4">
          {tokenType.map(token => (
            <div key={token}>
              <label className="block text-sm mb-1 text-gray-700 capitalize">{token}</label>
              <input
                type="text"
                value={tokens[token]}
                onChange={e => handleTokenChange(token, e.target.value)}
                placeholder="토큰을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          ))}
        </div>

        <input
          type="text"
          value={session}
          onChange={e => setSession(e.target.value)}
          placeholder="어드민 인증 세션 입력"
          className="w-full pt-2 px-3 py-2 border border-gray-300 rounded-md text-sm"
        />

        <div className="mt-4 flex justify-end">
          <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white">
            토큰 설정
          </button>
        </div>
      </form>
    </Card>
  );
}

export default TokenSetting;
