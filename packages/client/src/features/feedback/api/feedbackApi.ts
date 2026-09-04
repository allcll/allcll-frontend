import { fetchOnAPI } from '@/shared/api/api';

/**
 * 후기를 남길 수 있는 서비스 구분
 * 백엔드 OperationType enum과 동일한 값으로 유지합니다.
 * (OperationType 의 REVIEW 는 후기 서비스 자체의 운영 기간을 가리키는 값이라 제외)
 */
export const FEEDBACK_CATEGORIES = [
  'ALL',
  'TIMETABLE',
  'BASKETS',
  'SIMULATION',
  'LIVE',
  'PRESEAT',
  'GRADUATION',
] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

// 백엔드 측 limit과 동일하게 설정
export const DETAIL_MAX_LENGTH = 1000;

export interface FeedbackPayload {
  rate: 1 | 2 | 3;
  detail: string;
  operationType: FeedbackCategory;
}

export async function submitFeedback(payload: FeedbackPayload): Promise<Response> {
  const response = await fetchOnAPI('/api/review', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response;
}
