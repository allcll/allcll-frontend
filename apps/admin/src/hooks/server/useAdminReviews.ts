import { useQuery } from '@tanstack/react-query';
import { fetchJsonOnAPI } from '@/utils/api.ts';

export const OPERATION_TYPE_LABEL = {
  ALL: '전체',
  TIMETABLE: '시간표',
  BASKETS: '관심과목',
  SIMULATION: '수강신청 연습',
  LIVE: '실시간 여석',
  PRESEAT: '사전좌석',
  GRADUATION: '졸업요건',
  REVIEW: '후기',
} as const;

export type OperationType = keyof typeof OPERATION_TYPE_LABEL;
export const OPERATION_TYPES = Object.keys(OPERATION_TYPE_LABEL) as OperationType[];

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
    staleTime: Infinity,
  });
}

const fetchAdminReviews = async () => {
  return await fetchJsonOnAPI<ReviewsResponse>('/api/admin/review');
};
