import { fetchOnAPI } from '@/shared/api/api';

export interface FeedbackPayload {
  rate: 1 | 2 | 3;
  detail: string;
  operationType: 'GRADUATION';
}

export interface FeedbackResponse {
  success: boolean;
}

export async function submitFeedback(payload: FeedbackPayload): Promise<FeedbackResponse> {
  const response = await fetchOnAPI('/api/review', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return { success: true };
}
