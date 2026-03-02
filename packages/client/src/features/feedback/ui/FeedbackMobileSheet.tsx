import { useEffect } from 'react';
import BottomSheet from '@/shared/ui/bottomsheet/BottomSheet';
import BottomSheetHeader from '@/shared/ui/bottomsheet/BottomSheetHeader';
import { FeedbackActions, FeedbackFields, FeedbackSuccess } from './FeedbackSharedContent';
import { Flex } from '@allcll/allcll-ui';

type Props = {
  success: boolean;
  rate: 0 | 1 | 2 | 3;
  setRate: (rate: 1 | 2 | 3) => void;
  detail: string;
  setDetail: (value: string) => void;
  error: string | null;
  isPending: boolean;
  onClose: () => void;
  onDontShowAgain: () => void;
  onSubmit: () => void;
};

export default function FeedbackMobileSheet({
  success,
  rate,
  setRate,
  detail,
  setDetail,
  error,
  isPending,
  onClose,
  onDontShowAgain,
  onSubmit,
}: Props) {
  return (
    <BottomSheet>
      {({ collapseToMin }) => (
        <FeedbackContainer
          success={success}
          rate={rate}
          setRate={setRate}
          detail={detail}
          setDetail={setDetail}
          error={error}
          isPending={isPending}
          onClose={onClose}
          onDontShowAgain={onDontShowAgain}
          onSubmit={onSubmit}
          collapseToMin={collapseToMin}
        />
      )}
    </BottomSheet>
  );
}

type ContentProps = Props & {
  collapseToMin: (height?: number) => void;
};

function FeedbackContainer({
  success,
  rate,
  setRate,
  detail,
  setDetail,
  error,
  isPending,
  onClose,
  onDontShowAgain,
  onSubmit,
  collapseToMin,
}: ContentProps) {
  useEffect(() => {
    collapseToMin(380);
  }, [collapseToMin]);

  return !success ? (
    <>
      <BottomSheetHeader headerType="close" title="졸업요건 검사 피드백" onClose={onClose} />
      <div className="px-4 pb-4">
        <FeedbackFields rate={rate} setRate={setRate} detail={detail} setDetail={setDetail} error={error} />
        <Flex justify="justify-end" className="gap-2 pt-3">
          <FeedbackActions isPending={isPending} onDontShowAgain={onDontShowAgain} onSubmit={onSubmit} />
        </Flex>
      </div>
    </>
  ) : (
    <div className="px-4 pb-4">
      <FeedbackSuccess />
    </div>
  );
}
