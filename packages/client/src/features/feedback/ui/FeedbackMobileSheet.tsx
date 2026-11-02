import BottomSheet from '@/shared/ui/bottomsheet/BottomSheet';
import { FeedbackActions, FeedbackFields, FeedbackSuccess } from './FeedbackSharedContent';
import { Flex } from '@allcll/allcll-ui';
import type { IFeedbackViewProps } from './FeedbackViewProps';

export default function FeedbackMobileSheet({
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
  titles,
}: IFeedbackViewProps) {
  return (
    <BottomSheet title={titles.title} onClose={onClose}>
      <div>
        {!success ? (
          <>
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
          </>
        ) : (
          <FeedbackSuccess />
        )}
      </div>
    </BottomSheet>
  );
}
