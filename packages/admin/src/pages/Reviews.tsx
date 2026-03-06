import { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewStats from '@/components/reviews/ReviewStats';
import { useAdminReviews, OPERATION_TYPE_LABEL } from '@/hooks/server/useAdminReviews';
import { Filtering, CheckboxAdapter } from '@allcll/common';
import MultiSelectFilterOption from '@/components/common/MultiSelectFilterOption';
import { Button } from '@allcll/allcll-ui';

const FILTER_OPTIONS = Object.entries(OPERATION_TYPE_LABEL).map(([value, label]) => ({ label, value }));

function Reviews() {
  const { data: reviews = [], isLoading, isFetching, refetch } = useAdminReviews();
  const [selectedOperationTypes, setSelectedOperationTypes] = useState<string[]>([]);

  const filteredReviews = selectedOperationTypes.length === 0
    ? reviews
    : reviews.filter(r => selectedOperationTypes.includes(r.operationType));

  return (
    <div className="flex flex-col h-full gap-5">
      <PageHeader title="사용자 후기" description="사용자들이 남긴 후기를 확인합니다." />

      <div className="flex items-center gap-2">
        <Filtering label="도메인" selected={selectedOperationTypes.length > 0}>
          <MultiSelectFilterOption
            labelPrefix="도메인"
            selectedValues={selectedOperationTypes}
            setFilter={setSelectedOperationTypes}
            options={FILTER_OPTIONS}
            ItemComponent={CheckboxAdapter}
          />
        </Filtering>
        <Button variant="outlined" size="small" disabled={isFetching} onClick={() => refetch()}>
          새로고침
        </Button>
      </div>

      <ReviewStats reviews={filteredReviews} />
      <ReviewList reviews={filteredReviews} isLoading={isLoading} />
    </div>
  );
}

export default Reviews;
