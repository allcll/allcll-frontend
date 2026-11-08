import { useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import ReviewList, { type IReviewSort, type ReviewSortKey } from '@/components/reviews/ReviewList';
import ReviewStats from '@/components/reviews/ReviewStats';
import { useAdminReviews } from '@/hooks/server/useAdminReviews';
import type { Review } from '@/hooks/server/useAdminReviews';
import {
  Filtering,
  CheckboxAdapter,
  formatMultiSelectedLabel,
  OPERATION_TYPE_LABEL,
  OPERATION_TYPES,
  type OperationType,
} from '@allcll/common';
import MultiSelectFilterOption from '@/components/common/MultiSelectFilterOption';
import { Flex, Pagination } from '@allcll/allcll-ui';
import { usePagination } from '@/hooks/usePagination';

const getRatingLabel = (rate: string) => `${rate}점`;
const RATING_OPTIONS = ['1', '2', '3'].map(value => ({ label: getRatingLabel(value), value }));
const ANONYMOUS_YEAR = 'anonymous';

const getStudentYear = (studentId: string) => (/^\d{8}$/.test(studentId) ? studentId.substring(0, 2) : ANONYMOUS_YEAR);
const getYearLabel = (year: string) => (year === ANONYMOUS_YEAR ? '비로그인' : `${year}학번`);

type ReviewComparator = (a: Review, b: Review) => number;

// createdAt 누락 데이터는 정렬 방향과 무관하게 항상 맨 뒤로. ISO 문자열은 사전순 = 시간순.
const compareByCreatedAt =
  (direction: 'asc' | 'desc'): ReviewComparator =>
  (a, b) => {
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    const compared = a.createdAt.localeCompare(b.createdAt);
    return direction === 'asc' ? compared : -compared;
  };

const DEFAULT_SORT_DIRECTION: Record<ReviewSortKey, IReviewSort['direction']> = {
  createdAt: 'desc',
  studentId: 'asc',
  rate: 'desc',
};

const getReviewComparator = ({ key, direction }: IReviewSort): ReviewComparator => {
  if (key === 'createdAt') return compareByCreatedAt(direction);
  const sign = direction === 'asc' ? 1 : -1;
  if (key === 'rate') return (a, b) => sign * (a.rate - b.rate);
  return (a, b) => sign * a.studentId.localeCompare(b.studentId);
};

function Reviews() {
  const { data: reviews = [], isLoading, isError } = useAdminReviews();
  const [selectedOperationTypes, setSelectedOperationTypes] = useState<OperationType[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [sort, setSort] = useState<IReviewSort | null>(null);

  const categoryOptions = useMemo(() => {
    const categories = new Set(reviews.map(r => r.operationType));
    return OPERATION_TYPES.filter(type => categories.has(type)).map(value => ({
      label: OPERATION_TYPE_LABEL[value],
      value,
    }));
  }, [reviews]);

  const yearOptions = useMemo(() => {
    const years = [...new Set(reviews.map(r => getStudentYear(r.studentId)))].sort((a, b) => a.localeCompare(b));
    return years.map(value => ({ label: getYearLabel(value), value }));
  }, [reviews]);

  const handleSort = (key: ReviewSortKey) => {
    setSort(prev => {
      if (prev?.key !== key) return { key, direction: DEFAULT_SORT_DIRECTION[key] };
      if (prev.direction === DEFAULT_SORT_DIRECTION[key])
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      return null;
    });
  };

  const filteredReviews = reviews
    .filter(r => !selectedOperationTypes.length || selectedOperationTypes.includes(r.operationType))
    .filter(r => !selectedYears.length || selectedYears.includes(getStudentYear(r.studentId)))
    .filter(r => !selectedRatings.length || selectedRatings.includes(String(r.rate)))
    .sort(getReviewComparator(sort ?? { key: 'createdAt', direction: 'desc' }));

  const { page, totalPages, setPage, pageItems } = usePagination(
    filteredReviews,
    JSON.stringify([selectedOperationTypes, selectedYears, selectedRatings, sort]),
  );

  const filterBar = (
    <Flex align="center" justify="between" wrap gap={2}>
      <Flex align="center" gap={2}>
        <Filtering
          label={formatMultiSelectedLabel('카테고리', selectedOperationTypes, type => OPERATION_TYPE_LABEL[type])}
          selected={selectedOperationTypes.length > 0}
        >
          <MultiSelectFilterOption
            labelPrefix="카테고리"
            selectedValues={selectedOperationTypes}
            setFilter={setSelectedOperationTypes}
            options={categoryOptions}
            ItemComponent={CheckboxAdapter}
          />
        </Filtering>
        <Filtering
          label={formatMultiSelectedLabel('학번', selectedYears, getYearLabel)}
          selected={selectedYears.length > 0}
        >
          <MultiSelectFilterOption
            labelPrefix="학번"
            selectedValues={selectedYears}
            setFilter={setSelectedYears}
            options={yearOptions}
            ItemComponent={CheckboxAdapter}
          />
        </Filtering>
        <Filtering
          label={formatMultiSelectedLabel('평점', selectedRatings, getRatingLabel)}
          selected={selectedRatings.length > 0}
        >
          <MultiSelectFilterOption
            labelPrefix="평점"
            selectedValues={selectedRatings}
            setFilter={setSelectedRatings}
            options={RATING_OPTIONS}
            ItemComponent={CheckboxAdapter}
          />
        </Filtering>
      </Flex>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </Flex>
  );

  return (
    <div className="flex flex-col h-full gap-5">
      <PageHeader title="사용자 후기" description="사용자들이 남긴 후기를 확인합니다." />

      <main className="flex flex-col gap-5">
        <ReviewStats reviews={filteredReviews} />
        <ReviewList
          reviews={pageItems}
          isLoading={isLoading}
          isError={isError}
          sort={sort}
          onSort={handleSort}
          filterBar={filterBar}
        />
      </main>
    </div>
  );
}

export default Reviews;
