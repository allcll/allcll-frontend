import FeedbackDesktopModal from '@/features/feedback/ui/FeedbackDesktopModal';
import FeedbackMobileSheet from '@/features/feedback/ui/FeedbackMobileSheet';
import useFeedbackModalController from '@/features/feedback/lib/useFeedbackModalController';
import FeedbackPeekBar from '@/features/feedback/ui/FeedbackPeekBar';
import { FeedbackCategory } from '@/features/feedback/api/feedbackApi';
import { FeedbackOpenMode } from '../lib/FeedbackTrigger';
import useFeedbackTitle from '../lib/useFeedbackTitle';
import useMobile from '@/shared/lib/useMobile';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  category: FeedbackCategory;
  openMode?: FeedbackOpenMode;
  // 자동 노출을 억제하는 버튼, 사용자가 직접 여는 진입에서는 비활성화
  showDontShowAgain?: boolean;
};

export const FeedbackModal = ({ isOpen, onClose, category, openMode = 'auto', showDontShowAgain = true }: Props) => {
  const isMobile = useMobile();
  const titles = useFeedbackTitle(category, openMode);
  const peekMessage = openMode === 'auto' ? titles.peekMessage : undefined;
  const controller = useFeedbackModalController({
    isOpen,
    onClose,
    isMobile,
    category,
    opensSheetDirectly: !peekMessage,
  });

  if (!isOpen) return null;

  if (isMobile && peekMessage && !controller.isSheetOpen) {
    return <FeedbackPeekBar message={peekMessage} onOpen={controller.openSheet} onClose={controller.handleClose} />;
  }

  const sharedProps = {
    success: controller.success,
    rate: controller.rate,
    setRate: controller.setRate,
    detail: controller.detail,
    setDetail: controller.setDetail,
    error: controller.error,
    isPending: controller.isPending,
    canSubmit: controller.canSubmit,
    onClose: controller.handleClose,
    onDontShowAgain: showDontShowAgain ? controller.handleDontShowAgain : undefined,
    onSubmit: controller.handleSubmit,
    titles,
  };

  return isMobile ? <FeedbackMobileSheet {...sharedProps} /> : <FeedbackDesktopModal {...sharedProps} />;
};

export default FeedbackModal;
