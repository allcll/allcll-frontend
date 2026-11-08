import BottomSheet from '@/shared/ui/bottomsheet/BottomSheet';
import { FeedbackActions, FeedbackFields, FeedbackSuccess } from './FeedbackSharedContent';
import { Flex } from '@allcll/allcll-ui';
import type { IFeedbackViewProps } from './FeedbackViewProps';

export default function FeedbackMobileSheet({
  isOpen,
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
}: IFeedbackViewProps & { isOpen: boolean }) {
  return (
    <BottomSheet title={titles.title} isOpen={isOpen} onClose={onClose}>
      <div>
        {!success ? (
          <Flex direction="flex-col" gap="gap-6">
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
            <BottomSheet.Footer>
              <FeedbackActions
                isPending={isPending}
                canSubmit={canSubmit}
                onDontShowAgain={onDontShowAgain}
                onSubmit={onSubmit}
              />
            </BottomSheet.Footer>
          </Flex>
        ) : (
          <FeedbackSuccess />
        )}
      </div>
    </BottomSheet>
  );
}
