import { useNavigate } from 'react-router-dom';
import { TextLink } from '@allcll/allcll-ui';
import type { Review } from '@/hooks/server/useAdminReviews';

interface IReviewAuthorProps {
  review: Review;
  className?: string;
}

function ReviewAuthor({ review, className = '' }: Readonly<IReviewAuthorProps>) {
  const navigate = useNavigate();

  if (review.operationType !== 'GRADUATION') {
    return (
      <span className={`block truncate ${className}`} title={review.studentId}>
        {review.studentId}
      </span>
    );
  }

  return (
    <TextLink asChild className="text-sm font-medium">
      <button
        onClick={e => {
          e.stopPropagation();
          navigate(`/reviews/graduation/${review.studentId}`);
        }}
        onKeyDown={e => e.stopPropagation()}
        aria-label={`${review.studentId} 졸업요건 조회`}
      >
        {review.studentId}
      </button>
    </TextLink>
  );
}

export default ReviewAuthor;
