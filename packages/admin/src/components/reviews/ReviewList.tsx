import { useState } from 'react';
import { Card, Flex, EmptyState, LoadingState, Table } from '@allcll/allcll-ui';
import type { Review } from '@/hooks/server/useAdminReviews';
import ReviewItem from './ReviewItem';
import ReviewViewModal from './ReviewViewModal';
import SectionHeader from '@/components/common/SectionHeader';

export type ReviewSortKey = 'createdAt' | 'studentId' | 'rate';

export interface IReviewSort {
  key: ReviewSortKey;
  direction: 'asc' | 'desc';
}

// 순서는 ReviewItem의 셀 순서와 일치해야 함
const COLUMNS: { label: string; width: string; sortKey?: ReviewSortKey }[] = [
  { label: '작성자', width: 'w-28', sortKey: 'studentId' },
  { label: '카테고리', width: 'w-32' },
  { label: '평점', width: 'w-24', sortKey: 'rate' },
  { label: '후기 내용', width: '' },
  { label: '등록일', width: 'w-36', sortKey: 'createdAt' },
];

interface IReviewListProps {
  reviews: Review[];
  isLoading: boolean;
  isError: boolean;
  sort: IReviewSort | null;
  onSort: (key: ReviewSortKey) => void;
  filterBar?: React.ReactNode;
}

function ReviewList({ reviews, isLoading, isError, sort, onSort, filterBar }: Readonly<IReviewListProps>) {
  const [viewTarget, setViewTarget] = useState<Review | null>(null);

  return (
    <Flex direction="flex-col" gap="gap-2" className="h-full">
      <SectionHeader title="후기 목록" description="서비스별 사용자 후기를 확인합니다." />

      {filterBar}

      <Card className="overflow-hidden flex flex-col flex-1 min-h-0">
        <Table
          wrapperClassName="flex flex-col flex-1 min-h-0"
          scrollClassName="h-full overflow-y-auto"
          className="table-fixed"
        >
          <Table.Head sticky>
            {COLUMNS.map(column => (
              <Table.HeaderCell
                key={column.label}
                align="left"
                className={column.width}
                sortDirection={column.sortKey && sort?.key === column.sortKey ? sort.direction : null}
                onSort={column.sortKey ? () => onSort(column.sortKey!) : undefined}
              >
                {column.label}
              </Table.HeaderCell>
            ))}
          </Table.Head>
          <Table.Body>
            {isLoading && (
              <tr>
                <td colSpan={COLUMNS.length} className="py-8 text-center">
                  <LoadingState />
                </td>
              </tr>
            )}
            {!isLoading && isError && (
              <tr>
                <td colSpan={COLUMNS.length} className="py-8 text-center text-sm text-danger-500">
                  후기 데이터를 불러오는 데 실패했습니다.
                </td>
              </tr>
            )}
            {!isLoading && !isError && reviews.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="py-8 text-center">
                  <EmptyState title="등록된 후기가 없습니다." />
                </td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              reviews.map(review => <ReviewItem key={review.id} review={review} onView={setViewTarget} />)}
          </Table.Body>
        </Table>
      </Card>
      <div className="pb-6" />

      {viewTarget && <ReviewViewModal review={viewTarget} onClose={() => setViewTarget(null)} />}
    </Flex>
  );
}

export default ReviewList;
