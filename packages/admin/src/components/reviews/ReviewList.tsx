import { Card, Flex, SupportingText } from '@allcll/allcll-ui';
import { Review } from '@/hooks/server/useAdminReviews';
import ReviewItem from './ReviewItem';
import SectionHeader from '@/components/common/SectionHeader';

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
  isError: boolean;
  filterBar?: React.ReactNode;
}

function ReviewList({ reviews, isLoading, isError, filterBar }: ReviewListProps) {
  return (
    <Flex direction="flex-col" gap="gap-2" className="h-full">
      <SectionHeader title="후기 목록" description="서비스별 사용자 후기를 확인합니다." />

      {filterBar}

      <Card className="overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-y-auto flex-1">
          <table className="w-full border-collapse table-fixed">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50 text-sm text-gray-500">
                <th className="text-left px-4 py-2 font-medium w-32">학번</th>
                <th className="text-left px-4 py-2 font-medium w-32">도메인</th>
                <th className="text-left px-4 py-2 font-medium w-24">평점</th>
                <th className="text-left px-4 py-2 font-medium">후기 내용</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={4} className="py-8 text-center">
                    <SupportingText>불러오는 중...</SupportingText>
                  </td>
                </tr>
              )}
              {!isLoading && isError && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-red-500">
                    후기 데이터를 불러오는데 실패했습니다.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && reviews.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center">
                    <SupportingText>등록된 후기가 없습니다.</SupportingText>
                  </td>
                </tr>
              )}
              {!isLoading && !isError && reviews.map(review => <ReviewItem key={review.id} review={review} />)}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="pb-6" />
    </Flex>
  );
}

export default ReviewList;
