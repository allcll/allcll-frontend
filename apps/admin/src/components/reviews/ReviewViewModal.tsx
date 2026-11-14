import { Button, Dialog, Flex, SupportingText } from '@allcll/allcll-ui';
import OperationTypeBadge from '@/components/common/OperationTypeBadge';
import ReviewAuthor from './ReviewAuthor';
import ReviewRate from './ReviewRate';
import type { Review } from '@/hooks/server/useAdminReviews';
import { formatDateTime } from '@/utils/formatTime';

interface IReviewViewModalProps {
  review: Review;
  onClose: () => void;
}

function ReviewViewModal({ review, onClose }: Readonly<IReviewViewModalProps>) {
  return (
    <Dialog title="후기 상세" onClose={onClose}>
      <Dialog.Content className="sm:py-5">
        <Flex direction="column" gap={4} className="w-160 max-w-full">
          <Flex direction="column" gap={1.5}>
            <Flex align="center" gap={2}>
              <OperationTypeBadge operationType={review.operationType} />
              <ReviewRate rate={review.rate} />
              <SupportingText className="ml-auto shrink-0">{formatDateTime(review.createdAt)}</SupportingText>
            </Flex>
            <Flex align="center" gap={1} className="min-w-0 text-sm">
              <span className="shrink-0 text-fg-subtle">작성자</span>
              <ReviewAuthor review={review} className="text-fg-secondary" />
            </Flex>
          </Flex>
          <div className="rounded-md bg-surface-subtle p-4">
            {review.detail ? (
              <p className="text-sm text-fg-secondary leading-relaxed whitespace-pre-wrap break-words">
                {review.detail}
              </p>
            ) : (
              <SupportingText>작성한 내용이 없습니다.</SupportingText>
            )}
          </div>
        </Flex>
      </Dialog.Content>
      <Dialog.Footer>
        <Button variant="solid" color="gray" size="medium" onClick={onClose}>
          닫기
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export default ReviewViewModal;
