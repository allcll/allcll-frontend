import { FeedbackTitles } from '../lib/useFeedbackTitle';

export type FeedbackViewProps = {
  success: boolean;
  rate: 0 | 1 | 2 | 3;
  setRate: (rate: 1 | 2 | 3) => void;
  detail: string;
  setDetail: (value: string) => void;
  error: string | null;
  isPending: boolean;
  canSubmit: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onDontShowAgain?: () => void;
  titles: FeedbackTitles;
};
