import FeedbackFace from '@/assets/ci-icon.svg?react';
import CheckIcon from '@/assets/check.svg?react';
import { Button, Flex, Heading, SupportingText } from '@allcll/allcll-ui';
import { FeedbackTitles } from '../lib/useFeedbackTitle';

type FeedbackFieldsProps = {
  rate: 0 | 1 | 2 | 3;
  setRate: (rate: 1 | 2 | 3) => void;
  detail: string;
  setDetail: (value: string) => void;
  error: string | null;
  titles: FeedbackTitles;
};

type ActionProps = {
  isPending: boolean;
  onDontShowAgain: () => void;
  onSubmit: () => void;
};

export function FeedbackFields({ titles, rate, setRate, detail, setDetail, error }: FeedbackFieldsProps) {
  return (
    <>
      <Heading level={4}>{titles.radioTitle}</Heading>
      <Flex justify="justify-center" className="gap-3 mb-3">
        <RateInputs rate={1} currentRate={rate} onClick={() => setRate(1)} />
        <RateInputs rate={2} currentRate={rate} onClick={() => setRate(2)} />
        <RateInputs rate={3} currentRate={rate} onClick={() => setRate(3)} />
      </Flex>

      <Heading level={4} className="block text-sm text-gray-600 mb-2">
        {titles.textareaTitle}
      </Heading>
      <textarea
        className="w-full min-h-20 resize-y text-sm border rounded-md border-gray-400 py-2 px-3 focus:outline-none focus:ring-0 focus:border-primary-500"
        placeholder={titles.textareaPlaceholder}
        name="detail"
        value={detail}
        onChange={e => setDetail(e.target.value)}
      />

      {error && <p className="text-red-600 text-sm mb-3" aria-live='assertive'>{error}</p>}
    </>
  );
}

export function FeedbackActions({ isPending, onDontShowAgain, onSubmit }: ActionProps) {
  return (
    <>
      <Button variant="text" textColor="primary" size="medium" onClick={onDontShowAgain} disabled={isPending}>
        다시 보지 않기
      </Button>
      <Button variant="primary" size="medium" onClick={onSubmit} disabled={isPending}>
        {isPending ? '제출중...' : '제출하기'}
      </Button>
    </>
  );
}

export function FeedbackSuccess() {
  return (
    <Flex direction="flex-col" justify="justify-center" align="items-center" className="py-4">
      <Flex justify="justify-center" align="items-center" className="w-14 h-14 rounded-full bg-emerald-100 mb-3 animate-pulse">
        <CheckIcon className="text-emerald-600" />
      </Flex>
      <SupportingText className="text-primary">좋은 의견 주셔서 감사합니다</SupportingText>
    </Flex>
  );
}

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
