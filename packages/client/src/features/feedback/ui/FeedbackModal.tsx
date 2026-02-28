import { useEffect, useState } from 'react';
import FeedbackFace from './FeedbackFace';
import useFeedbackStore from '@/features/feedback/model/useFeedbackStore';
import useFeedbackMutation from '@/features/feedback/api/useFeedbackMutation';
import { Button, Flex, Heading, SupportingText } from '@allcll/allcll-ui';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const FeedbackModal = ({ isOpen, onClose }: Props) => {
  const [rate, setRate] = useState<1 | 2 | 3>(3);
  const [detail, setDetail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dontShowAgain = useFeedbackStore(s => s.dontShowAgain);
  const setDontShowAgain = useFeedbackStore(s => s.setDontShowAgain);
  
  const { mutate, isPending } = useFeedbackMutation();

  useEffect(() => {
    if (!isOpen) {
      setRate(3);
      setDetail('');
      setSuccess(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || dontShowAgain) return null;

  async function handleSubmit() {
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
            <Heading level={3}>서비스 만족도 평가</Heading>

            <Heading level={4} className="mt-1">얼마나 만족하시나요?</Heading>
            <Flex justify="justify-center" className="gap-3 mb-3">
              <button
                aria-label="하"
                className={`flex flex-col items-center gap-2 p-2 rounded-xl ${rate === 1 ? 'ring-2 ring-blue-300' : ''}`}
                onClick={() => setRate(1)}
              >
                <FeedbackFace variant="sad" size={48} />
                <span className="text-sm">하</span>
              </button>

              <button
                aria-label="중"
                className={`flex flex-col items-center gap-2 p-2 rounded-xl ${rate === 2 ? 'ring-2 ring-blue-300' : ''}`}
                onClick={() => setRate(2)}
              >
                <FeedbackFace variant="neutral" size={48} />
                <span className="text-sm">중</span>
              </button>

              <button
                aria-label="상"
                className={`flex flex-col items-center gap-2 p-2 rounded-xl ${rate === 3 ? 'ring-2 ring-blue-300' : ''}`}
                onClick={() => setRate(3)}
              >
                <FeedbackFace variant="happy" size={48} />
                <span className="text-sm">상</span>
              </button>
            </Flex>

            <Heading level={4} className="block text-sm text-gray-600 mb-2">자세한 의견 (선택)</Heading>
            <textarea
              className="w-full border rounded-md p-2 min-h-[72px] mb-3 resize-y"
              placeholder="왜 그렇게 생각하셨나요? (선택)"
              name="detail"
              value={detail}
              onChange={e => setDetail(e.target.value)}
            />

            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            <Flex className="gap-3">
              <Button variant="primary" size="medium" onClick={handleSubmit} disabled={isPending}>
                {isPending ? '제출중...' : '제출'}
              </Button>
              <Button variant="contain" textColor="secondary" size="medium" onClick={handleDontShowAgain} disabled={isPending}>
                다신 보지 않기
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
              <SupportingText className="text-primary">의견 주셔서 감사합니다</SupportingText>
            </div>
          </Flex>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
