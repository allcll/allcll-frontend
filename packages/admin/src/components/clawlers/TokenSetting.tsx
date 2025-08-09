import Card from '@allcll/common/components/Card';
import { useState } from 'react';
import CustomButton from '@allcll/common/components/Button';

const initialTokens = {
  tokenJ: '',
  tokenU: '',
  tokenR: '',
  tokenL: '',
  key1: '',
  key2: '',
};

interface tokensType {
  tokenJ: string;
  tokenU: string;
  tokenR: string;
  tokenL: string;
  key1: string;
  key2: string;
  [key: string]: string;
}

const tokenType = ['tokenJ', 'tokenU', 'tokenR', 'tokenL', 'key1', 'key2'];

function TokenSetting() {
  const [tokens, setTokens] = useState<tokensType>(initialTokens);

  const handleTokenChange = (key: keyof tokensType, value: string) => {
    setTokens(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <h3 className="text-md font-semibold mb-3">인증 정보 설정</h3>
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

      <div className="mt-4 flex justify-end">
        <CustomButton
          onClick={() => {
            // TODO: 토큰 4개 저장
          }}
          variants="primary"
        >
          토큰 설정
        </CustomButton>
      </div>
    </Card>
  );
}

export default TokenSetting;
