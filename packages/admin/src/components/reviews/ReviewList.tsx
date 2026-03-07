import { SupportingText } from '@allcll/allcll-ui';
import { Review } from '@/hooks/server/useAdminReviews';
import ReviewItem from './ReviewItem';
import SectionHeader from '@/components/common/SectionHeader';

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
}

function ReviewList({ reviews, isLoading }: ReviewListProps) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <SectionHeader title="후기 목록" description="서비스별 사용자 후기를 확인합니다." />

      <div className="rounded-md border border-gray-200 overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-y-auto flex-1">
          <table className="w-full border-collapse table-fixed">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 w-32">학번</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 w-32">도메인</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 w-24">평점</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">후기 내용</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center">
                    <SupportingText>불러오는 중...</SupportingText>
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center">
                    <SupportingText>등록된 후기가 없습니다.</SupportingText>
                  </td>
                </tr>
              ) : (
                reviews.map(review => <ReviewItem key={review.id} review={review} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReviewList;
