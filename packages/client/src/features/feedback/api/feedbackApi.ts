import { fetchJsonOnAPI } from '@/shared/api/api';

export interface FeedbackPayload {
  rate: 1 | 2 | 3;
  detail: string;
  operationType: 'GRADUATION';
}

export interface FeedbackResponse {
  success: boolean;
}

export async function submitFeedback(payload: FeedbackPayload): Promise<FeedbackResponse> {
  return fetchJsonOnAPI('/api/review', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
