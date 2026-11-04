import { SupportingText, Table } from '@allcll/allcll-ui';
import OperationTypeBadge from '@/components/common/OperationTypeBadge';
import ReviewAuthor from './ReviewAuthor';
import ReviewRate from './ReviewRate';
import type { Review } from '@/hooks/server/useAdminReviews';
import { formatDateTime } from '@/utils/formatTime';

interface IReviewItemProps {
  review: Review;
  onView: (review: Review) => void;
}

function ReviewItem({ review, onView }: Readonly<IReviewItemProps>) {
  return (
    <Table.Row
      className="bg-white hover:bg-gray-50 transition-colors cursor-pointer"
      tabIndex={0}
      onClick={() => onView(review)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onView(review);
        }
      }}
    >
      <Table.Cell align="left" className="w-28">
        <ReviewAuthor review={review} className="text-sm text-gray-500" />
      </Table.Cell>
      <Table.Cell align="left" className="w-32">
        <OperationTypeBadge operationType={review.operationType} />
      </Table.Cell>
      <Table.Cell align="left" className="w-24">
        <ReviewRate rate={review.rate} />
      </Table.Cell>
      <Table.Cell align="left" className={`truncate ${review.detail ? 'text-gray-700' : 'text-gray-400'}`}>
        {review.detail || '내용 없음'}
      </Table.Cell>
      <Table.Cell align="left" className="w-36">
        <SupportingText className="whitespace-nowrap">{formatDateTime(review.createdAt)}</SupportingText>
      </Table.Cell>
    </Table.Row>
  );
}

export default ReviewItem;
