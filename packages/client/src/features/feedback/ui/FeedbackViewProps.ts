import type { FeedbackCategory } from '../api/feedbackApi';
import type { FeedbackTitles } from '../lib/getFeedbackTitle';

export interface IFeedbackViewProps {
  success: boolean;
  rate: 0 | 1 | 2 | 3;
  setRate: (rate: 1 | 2 | 3) => void;
  detail: string;
  setDetail: (value: string) => void;
  category: FeedbackCategory;
  onCategoryChange?: (category: FeedbackCategory) => void;
  error: string | null;
  isPending: boolean;
  canSubmit: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onDontShowAgain?: () => void;
  titles: FeedbackTitles;
}
