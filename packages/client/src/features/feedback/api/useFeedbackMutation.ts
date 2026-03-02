import { useMutation } from '@tanstack/react-query';
import { submitFeedback } from './feedbackApi';
import type { FeedbackPayload, FeedbackResponse } from './feedbackApi';

export function useFeedbackMutation() {
  return useMutation<FeedbackResponse, Error, FeedbackPayload>({
    mutationFn: submitFeedback,
  });
}

export default useFeedbackMutation;
