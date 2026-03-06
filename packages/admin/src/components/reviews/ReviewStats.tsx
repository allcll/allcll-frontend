import { Card, Flex, Heading, SupportingText } from '@allcll/allcll-ui';
import { Review } from '@/hooks/server/useAdminReviews';
import CiIcon from '@/assets/ci-icon.svg?react';

function RatingIcon({ fill }: { fill: number }) {
  const clampedFill = Math.min(1, Math.max(0, fill));
  return (
    <div className="relative inline-flex h-5 w-5">
      <CiIcon className="h-5 w-5 mood-smile text-gray-300 absolute inset-0" />
      <div className="absolute left-0 right-0 bottom-0 overflow-hidden" style={{ height: `${clampedFill * 100}%` }}>
        <CiIcon className="h-5 w-5 mood-smile text-primary-500 absolute bottom-0 left-0" />
      </div>
    </div>
  );
}

interface ReviewStatsProps {
  reviews: Review[];
}

function ReviewStats({ reviews }: ReviewStatsProps) {
  const total = reviews.length;
  const avg = total > 0 ? reviews.reduce((sum, r) => sum + r.rate, 0) / total : 0;
  const roundedAvg = Math.round(avg * 10) / 10;

  return (
    <Flex gap="gap-4">
      <Card variant="outlined" className="flex-1">
        <Flex direction="flex-col" gap="gap-1">
          <SupportingText>전체 후기</SupportingText>
          <Flex align="items-baseline" gap="gap-1">
            <Heading level={2}>{total}</Heading>
            <SupportingText>건</SupportingText>
          </Flex>
        </Flex>
      </Card>

      <Card variant="outlined" className="flex-1">
        <Flex direction="flex-col" gap="gap-1">
          <SupportingText>평균 평점</SupportingText>
          <Heading level={2}>{roundedAvg}</Heading>
          <Flex gap="gap-1" className="mt-1">
            {[1, 2, 3].map(i => (
              <RatingIcon key={i} fill={avg - (i - 1)} />
            ))}
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}

export default ReviewStats;
