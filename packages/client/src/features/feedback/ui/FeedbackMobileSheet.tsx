import { useEffect } from 'react';
import BottomSheet from '@/shared/ui/bottomsheet/BottomSheet';
import BottomSheetHeader from '@/shared/ui/bottomsheet/BottomSheetHeader';
import { FeedbackActions, FeedbackFields, FeedbackSuccess } from './FeedbackSharedContent';
import { Flex } from '@allcll/allcll-ui';
import { FeedbackViewProps } from './FeedbackViewProps';

export default function FeedbackMobileSheet(props: FeedbackViewProps) {
  return (
    <BottomSheet>{({ collapseToMin }) => <FeedbackContainer {...props} collapseToMin={collapseToMin} />}</BottomSheet>
  );
}

type FeedbackContainerProps = FeedbackViewProps & {
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
  canSubmit,
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
        <FeedbackFields
          titles={titles}
          rate={rate}
          setRate={setRate}
          detail={detail}
          setDetail={setDetail}
          error={error}
        />
        <Flex justify="justify-end" className="gap-2 pt-3">
          <FeedbackActions
            isPending={isPending}
            canSubmit={canSubmit}
            onDontShowAgain={onDontShowAgain}
            onSubmit={onSubmit}
          />
        </Flex>
      </div>
    </>
  ) : (
    <div className="px-4 pb-4">
      <FeedbackSuccess />
    </div>
  );
}
