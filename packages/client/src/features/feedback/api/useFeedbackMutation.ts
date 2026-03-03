import { useMutation } from '@tanstack/react-query';
import { submitFeedback } from './feedbackApi';
import type { FeedbackPayload } from './feedbackApi';

export function useFeedbackMutation() {
  return useMutation<Response, Error, FeedbackPayload>({
    mutationFn: submitFeedback,
  });
}

export default useFeedbackMutation;
