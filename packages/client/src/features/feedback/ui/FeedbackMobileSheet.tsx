import { useEffect } from 'react';
import BottomSheet from '@/shared/ui/bottomsheet/BottomSheet';
import BottomSheetHeader from '@/shared/ui/bottomsheet/BottomSheetHeader';
import { FeedbackActions, FeedbackFields, FeedbackSuccess } from './FeedbackSharedContent';
import { Flex } from '@allcll/allcll-ui';
import type { IFeedbackViewProps } from './FeedbackViewProps';

const SHEET_HEIGHT = 380;
const SHEET_HEIGHT_WITH_CATEGORY = 500;

export default function FeedbackMobileSheet(props: IFeedbackViewProps) {
  return (
    <BottomSheet>{({ collapseToMin }) => <FeedbackContainer {...props} collapseToMin={collapseToMin} />}</BottomSheet>
  );
}

interface IFeedbackContainerProps extends IFeedbackViewProps {
  collapseToMin: (height?: number) => void;
}

function FeedbackContainer({
  success,
  rate,
  setRate,
  detail,
  setDetail,
  category,
  onCategoryChange,
  error,
  isPending,
  canSubmit,
  onClose,
  onDontShowAgain,
  onSubmit,
  collapseToMin,
  titles,
}: IFeedbackContainerProps) {
  const sheetHeight = onCategoryChange ? SHEET_HEIGHT_WITH_CATEGORY : SHEET_HEIGHT;

  useEffect(() => {
    collapseToMin(sheetHeight);
  }, [collapseToMin, sheetHeight]);

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
          category={category}
          onCategoryChange={onCategoryChange}
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
