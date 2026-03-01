import { useEffect, useState } from 'react';
import FeedbackFace from '@/assets/ci-icon.svg?react';
import CloseIcon from '@/assets/x-gray.svg?react';
import useFeedbackStore from '@/features/feedback/model/useFeedbackStore';
import useFeedbackMutation from '@/features/feedback/api/useFeedbackMutation';
import { Button, Flex, Heading, IconButton, SupportingText } from '@allcll/allcll-ui';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const FeedbackModal = ({ isOpen, onClose }: Props) => {
  const [rate, setRate] = useState<0 | 1 | 2 | 3>(0);
  const [detail, setDetail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dontShowAgain = useFeedbackStore(s => s.dontShowAgain);
  const setDontShowAgain = useFeedbackStore(s => s.setDontShowAgain);
  
  const { mutate, isPending } = useFeedbackMutation();

  useEffect(() => {
    if (!isOpen) {
      setRate(0);
      setDetail('');
      setSuccess(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || dontShowAgain) return null;

  async function handleSubmit() {
    if (rate === 0) {
      setError('평점을 선택해주세요');
      setTimeout(() => setError(null), 3000);
      return;
    }

    mutate(
      { rate, detail: detail ?? '', operationType: 'GRADUATION' },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            onClose();
          }, 2000);
        },
        onError: (error) => {
          setError('응답을 제출할 수 없습니다');
          setTimeout(() => setError(null), 5000);
        },
      },
    );
  }

  function handleDontShowAgain() {
    setDontShowAgain(true);
    onClose();
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="w-80 bg-white rounded-2xl shadow-lg p-4">
        {!success ? (
          <div>
            <Flex justify="justify-between" className="mb-2">
              <Heading level={3} size='xl' className='font-bold'>졸업요건 검사 피드백</Heading>
              <IconButton label='창 닫기' onClick={onClose} icon={<CloseIcon className='text-gray-500 hover:text-gray-600'/>} />
            </Flex>
            
            <Heading level={4} className="mt-4">결과가 정확했나요?</Heading>
            <Flex justify="justify-center" className="gap-3 mb-3">
              <RateInputs rate={1} currentRate={rate} onClick={() => setRate(1)} />
              <RateInputs rate={2} currentRate={rate} onClick={() => setRate(2)} />
              <RateInputs rate={3} currentRate={rate} onClick={() => setRate(3)} />
            </Flex>

            <Heading level={4} className="block text-sm text-gray-600 mb-2">추가 의견을 남겨주세요 (선택)</Heading>
            <textarea
              className="w-full min-h-[80px] resize-y text-sm border rounded-md border-gray-400 py-2 px-3 focus:outline-none focus:ring-0 focus:border-primary-500"
              placeholder="복수전공, 교환학생, 재수강, 인정과목 등 특수한 케이스에서 오류가 있었다면 꼭 알려주세요."
              name="detail"
              value={detail}
              onChange={e => setDetail(e.target.value)}
            />

            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            <Flex className="gap-3 mt-4" justify="justify-start">
              <Button variant="primary" size="medium" onClick={handleSubmit} disabled={isPending}>
                {isPending ? '제출중...' : '제출하기'}
              </Button>
              <Button variant="text" textColor="primary" size="medium" onClick={handleDontShowAgain} disabled={isPending}>
                다시 보지 않기
              </Button>
            </Flex>
          </div>
        ) : (
          <Flex direction="flex-col" justify='justify-center' align='items-center' className="py-4">
            <Flex  justify='justify-center' align='items-center' className="w-14 h-14 rounded-full bg-green-100 mb-3 animate-pulse">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17l-5-5" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Flex>
            <div className="text-center">
              <SupportingText className="text-primary">좋은 의견 주셔서 감사합니다</SupportingText>
            </div>
          </Flex>
        )}
      </div>
    </div>
  );
};

interface RateButtonProps {
  rate: 1 | 2 | 3;
  currentRate: number;
  onClick: () => void;
}

function RateInputs({ rate, currentRate, onClick }: RateButtonProps) {
  const faces = {
    1: <FeedbackFace className="w-16 h-16 mood-sad" />,
    2: <FeedbackFace className="w-16 h-16 mood-normal" />,
    3: <FeedbackFace className="w-16 h-16 mood-smile" />,
  };

  const LabelText = ['많이 달라요', '조금 달라요', '정확해요'][rate - 1];

  return ( 
    <button
      role="radio"
      aria-checked={currentRate === rate}
      aria-label={LabelText}
      className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-colors duration-200 font-bold
        ${currentRate === rate ? 'text-primary' : 'text-gray-300 hover:text-blue-300'}`}
      onClick={onClick}
    >
      {faces[rate]}
      <span className="text-sm">{LabelText}</span>
    </button>
  );
}

export default FeedbackModal;
