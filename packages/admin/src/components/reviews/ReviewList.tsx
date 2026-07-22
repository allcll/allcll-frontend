import { Card, Flex, SupportingText } from '@allcll/allcll-ui';
import type { Review } from '@/hooks/server/useAdminReviews';
import ReviewItem from './ReviewItem';
import SectionHeader from '@/components/common/SectionHeader';

// 순서는 ReviewItem의 셀 순서와 일치해야 함
const COLUMNS: { label: string; width: string }[] = [
  { label: '학번', width: 'w-28' },
  { label: '도메인', width: 'w-32' },
  { label: '평점', width: 'w-24' },
  { label: '후기 내용', width: '' },
  { label: '등록일', width: 'w-36' },
];

interface IReviewListProps {
  reviews: Review[];
  isLoading: boolean;
  isError: boolean;
  filterBar?: React.ReactNode;
}

function ReviewList({ reviews, isLoading, isError, filterBar }: Readonly<IReviewListProps>) {
  return (
    <Flex direction="flex-col" gap="gap-2" className="h-full">
      <SectionHeader title="후기 목록" description="서비스별 사용자 후기를 확인합니다." />

      {filterBar}

      <Card className="overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-y-auto flex-1">
          <table className="w-full border-collapse table-fixed">
            <thead className="sticky top-0 z-content">
              <tr className="bg-gray-50 text-sm text-gray-500">
                {COLUMNS.map(column => (
                  <th key={column.label} className={`text-left px-4 py-2 font-medium ${column.width}`}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={COLUMNS.length} className="py-8 text-center">
                    <SupportingText>불러오는 중...</SupportingText>
                  </td>
                </tr>
              )}
              {!isLoading && isError && (
                <tr>
                  <td colSpan={COLUMNS.length} className="py-8 text-center text-sm text-red-500">
                    후기 데이터를 불러오는데 실패했습니다.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && reviews.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length} className="py-8 text-center">
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
