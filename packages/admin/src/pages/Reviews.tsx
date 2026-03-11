import { useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewStats from '@/components/reviews/ReviewStats';
import { useAdminReviews, OPERATION_TYPE_LABEL } from '@/hooks/server/useAdminReviews';
import { Filtering, CheckboxAdapter } from '@allcll/common';
import MultiSelectFilterOption from '@/components/common/MultiSelectFilterOption';
import { Button, Flex } from '@allcll/allcll-ui';

const DOMAIN_OPTIONS = Object.entries(OPERATION_TYPE_LABEL).map(([value, label]) => ({ label, value }));
const RATING_OPTIONS = [1, 2, 3].map(r => ({ label: `${r}점`, value: String(r) }));

function Reviews() {
  const { data: reviews = [], isLoading, isFetching, isError, refetch } = useAdminReviews();
  const [selectedOperationTypes, setSelectedOperationTypes] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);

  const yearOptions = useMemo(() => {
    const years = [...new Set(reviews.map(r => r.studentId.substring(0, 2)))].sort();
    return years.map(y => ({ label: `${y}학번`, value: y }));
  }, [reviews]);

  const filteredReviews = reviews
    .filter(r => !selectedOperationTypes.length || selectedOperationTypes.includes(r.operationType))
    .filter(r => !selectedYears.length || selectedYears.includes(r.studentId.substring(0, 2)))
    .filter(r => !selectedRatings.length || selectedRatings.includes(String(r.rate)));

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
