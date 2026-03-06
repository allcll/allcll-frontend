import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/utils/api.ts';

export type OperationType = 'GRADUATION';

export const OPERATION_TYPE_LABEL: Record<OperationType, string> = {
  GRADUATION: '졸업요건',
};

export interface Review {
  id: number;
  studentId: string;
  rate: 1 | 2 | 3;
  detail: string;
  operationType: OperationType;
}

interface ReviewsResponse {
  reviews: Review[];
}

export function useAdminReviews() {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: fetchAdminReviews,
    select: (data: ReviewsResponse) => data.reviews,
    staleTime: Infinity,
  });
}

const fetchAdminReviews = async () => {
  return await fetchJsonOnAPI<ReviewsResponse>('/api/admin/review');
};
