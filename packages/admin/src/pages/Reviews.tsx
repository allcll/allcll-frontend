import { useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewStats from '@/components/reviews/ReviewStats';
import { useAdminReviews, OPERATION_TYPE_LABEL, Review } from '@/hooks/server/useAdminReviews';
import { Filtering, CheckboxAdapter } from '@allcll/common';
import MultiSelectFilterOption from '@/components/common/MultiSelectFilterOption';
import { Button, Flex, ListboxOption } from '@allcll/allcll-ui';

const DOMAIN_OPTIONS = Object.entries(OPERATION_TYPE_LABEL).map(([value, label]) => ({ label, value }));
const RATING_OPTIONS = [1, 2, 3].map(r => ({ label: `${r}점`, value: String(r) }));

type ReviewSortKey = 'latest' | 'oldest' | 'studentId' | 'rateDesc' | 'rateAsc';

type ReviewComparator = (a: Review, b: Review) => number;

interface ReviewSortOption {
  value: ReviewSortKey;
  label: string;
  compare: ReviewComparator;
}

// createdAt 누락 데이터는 정렬 방향과 무관하게 항상 맨 뒤로. ISO 문자열은 사전순 = 시간순.
const compareByCreatedAt =
  (direction: 'asc' | 'desc'): ReviewComparator =>
  (a, b) => {
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    const compared = a.createdAt.localeCompare(b.createdAt);
    return direction === 'asc' ? compared : -compared;
  };

const SORT_OPTIONS: ReviewSortOption[] = [
  { value: 'latest', label: '최신순', compare: compareByCreatedAt('desc') },
  { value: 'oldest', label: '오래된순', compare: compareByCreatedAt('asc') },
  { value: 'studentId', label: '학번순', compare: (a, b) => a.studentId.localeCompare(b.studentId) },
  { value: 'rateDesc', label: '평점 높은순', compare: (a, b) => b.rate - a.rate },
  { value: 'rateAsc', label: '평점 낮은순', compare: (a, b) => a.rate - b.rate },
];

function Reviews() {
  const { data: reviews = [], isLoading, isFetching, isError, refetch } = useAdminReviews();
  const [selectedOperationTypes, setSelectedOperationTypes] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<ReviewSortKey>('latest');

  const yearOptions = useMemo(() => {
    const years = [...new Set(reviews.map(r => r.studentId.substring(0, 2)))].sort((a, b) => a.localeCompare(b));
    return years.map(y => ({ label: `${y}학번`, value: y }));
  }, [reviews]);

  const activeSortOption = SORT_OPTIONS.find(option => option.value === sortKey) ?? SORT_OPTIONS[0];

  const filteredReviews = reviews
    .filter(r => !selectedOperationTypes.length || selectedOperationTypes.includes(r.operationType))
    .filter(r => !selectedYears.length || selectedYears.includes(r.studentId.substring(0, 2)))
    .filter(r => !selectedRatings.length || selectedRatings.includes(String(r.rate)))
    .sort(activeSortOption.compare);

  const filterBar = (
    <Flex align="items-center" gap="gap-2">
      <Filtering label="도메인" selected={selectedOperationTypes.length > 0}>
        <MultiSelectFilterOption
          labelPrefix="도메인"
          selectedValues={selectedOperationTypes}
          setFilter={setSelectedOperationTypes}
          options={DOMAIN_OPTIONS}
          ItemComponent={CheckboxAdapter}
        />
      </Filtering>
      <Filtering label="학번" selected={selectedYears.length > 0}>
        <MultiSelectFilterOption
          labelPrefix="학번"
          selectedValues={selectedYears}
          setFilter={setSelectedYears}
          options={yearOptions}
          ItemComponent={CheckboxAdapter}
        />
      </Filtering>
      <Filtering label="평점" selected={selectedRatings.length > 0}>
        <MultiSelectFilterOption
          labelPrefix="평점"
          selectedValues={selectedRatings}
          setFilter={setSelectedRatings}
          options={RATING_OPTIONS}
          ItemComponent={CheckboxAdapter}
        />
      </Filtering>
      <Filtering label={`정렬: ${activeSortOption.label}`} selected={sortKey !== 'latest'}>
        <div className="flex flex-col gap-1 min-w-32">
          {SORT_OPTIONS.map(option => (
            <ListboxOption
              key={option.value}
              selected={sortKey === option.value}
              onSelect={() => setSortKey(option.value)}
              left={option.label}
            />
          ))}
        </div>
      </Filtering>
      <div className="ml-auto">
        <Button variant="outlined" size="small" disabled={isFetching} onClick={() => refetch()}>
          후기 불러오기
        </Button>
      </div>
    </Flex>
  );

  return (
    <div className="flex flex-col h-full gap-5">
      <PageHeader title="사용자 후기" description="사용자들이 남긴 후기를 확인합니다." />

      <main className="flex flex-col flex-1 min-h-0 gap-5">
        <ReviewStats reviews={filteredReviews} />
        <ReviewList reviews={filteredReviews} isLoading={isLoading} isError={isError} filterBar={filterBar} />
      </main>
    </div>
  );
}

export default Reviews;
