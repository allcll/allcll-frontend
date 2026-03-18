import { useEffect } from 'react';
import BottomSheet from '@/shared/ui/bottomsheet/BottomSheet';
import BottomSheetHeader from '@/shared/ui/bottomsheet/BottomSheetHeader';
import { FeedbackActions, FeedbackFields, FeedbackSuccess } from './FeedbackSharedContent';
import { Flex } from '@allcll/allcll-ui';
import { FeedbackTitles } from '../lib/useFeedbackTitle';

type FeedbackMobileSheetProps = {
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
  titles: FeedbackTitles;
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
  titles,
}: FeedbackMobileSheetProps) {
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
          titles={titles}
        />
      )}
    </BottomSheet>
  );
}

type FeedbackContainerProps = FeedbackMobileSheetProps & {
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
  titles,
}: FeedbackContainerProps) {
  useEffect(() => {
    collapseToMin(380);
  }, [collapseToMin]);

  return !success ? (
    <>
      <BottomSheetHeader headerType="close" title={titles.title} onClose={onClose} />
      <div className="px-4 pb-4">
        <FeedbackFields titles={titles} rate={rate} setRate={setRate} detail={detail} setDetail={setDetail} error={error} />
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
