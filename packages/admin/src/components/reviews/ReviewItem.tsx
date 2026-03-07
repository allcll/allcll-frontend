import { useState, useEffect, useRef } from 'react';
import { Badge, Flex, IconButton, SupportingText } from '@allcll/allcll-ui';
import { Review, OPERATION_TYPE_LABEL } from '@/hooks/server/useAdminReviews';
import CiIcon from '@/assets/ci-icon.svg?react';
import ArrowDownSvg from '@/assets/arrow-down.svg?react';

const MAX_RATE = 3;

interface ReviewItemProps {
  review: Review;
}

function ReviewItem({ review }: ReviewItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const detailRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const detailParagraph = detailRef.current;
    if (!detailParagraph) return;
    setIsClamped(detailParagraph.scrollHeight > detailParagraph.clientHeight);
  }, []);

  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
      <td className="px-4 py-3 align-top w-32">
        <SupportingText>{review.studentId}</SupportingText>
      </td>
      <td className="px-4 py-3 align-top w-24">
        <Badge variant="primary" appearance="outline">
          {OPERATION_TYPE_LABEL[review.operationType]}
        </Badge>
      </td>
      <td className="px-4 py-3 align-top w-24">
        <Flex align="items-center" gap="gap-0.5">
          {Array.from({ length: review.rate }).map((_, i) => (
            <CiIcon key={i} className="h-4 w-4 mood-smile text-primary-500" />
          ))}
          {Array.from({ length: MAX_RATE - review.rate }).map((_, i) => (
            <CiIcon key={`empty-${i}`} className="h-4 w-4 mood-smile text-gray-300" />
          ))}
        </Flex>
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex items-start gap-2">
          <p
            ref={detailRef}
            className={`text-sm text-gray-700 leading-relaxed flex-1 ${!isExpanded ? 'line-clamp-2' : ''}`}
          >
            {review.detail}
          </p>
          {isClamped && (
            <IconButton
              variant="plain"
              icon={<ArrowDownSvg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />}
              label={isExpanded ? '접기' : '더보기'}
              onClick={() => setIsExpanded(prev => !prev)}
              className="shrink-0 mt-0.5 text-gray-400 hover:text-gray-600"
            />
          )}
        </div>
      </td>
    </tr>
  );
}

export default ReviewItem;
