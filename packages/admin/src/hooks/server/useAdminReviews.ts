import { useQuery } from '@tanstack/react-query';
import type { OperationType } from '@allcll/common';
import { fetchJsonOnAPI } from '@/utils/api.ts';

export const MAX_RATE = 3;

export interface Review {
  id: number;
  studentId: string;
  rate: 1 | 2 | 3;
  detail: string;
  operationType: OperationType;
  createdAt: string;
}

interface ReviewsResponse {
  reviews: Review[];
}

export function useAdminReviews() {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: fetchAdminReviews,
    select: (data: ReviewsResponse) => data.reviews,
  });
}

const fetchAdminReviews = async () => {
  return await fetchJsonOnAPI<ReviewsResponse>('/api/admin/review');
};
