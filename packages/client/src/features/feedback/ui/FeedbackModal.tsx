import FeedbackDesktopModal from '@/features/feedback/ui/FeedbackDesktopModal';
import FeedbackMobileSheet from '@/features/feedback/ui/FeedbackMobileSheet';
import useFeedbackModalController from '@/features/feedback/lib/useFeedbackModalController';
import FeedbackPeekBar from '@/features/feedback/ui/FeedbackPeekBar';
import { FeedbackOpenMode } from '../lib/FeedbackTrigger';
import useFeedbackTitle from '../lib/useFeedbackTitle';
import useMobile from '@/shared/lib/useMobile';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  openMode?: FeedbackOpenMode;
};

export const FeedbackModal = ({ isOpen, onClose, openMode = 'auto' }: Props) => {
  const isMobile = useMobile();
  const controller = useFeedbackModalController({ isOpen, onClose, isMobile, openMode });
  const titles = useFeedbackTitle(openMode);

  if (!isOpen) return null;

  if (isMobile && !controller.isSheetOpen) {
    return <FeedbackPeekBar onOpen={controller.openSheet} onClose={controller.handleClose} />;
  }

  return isMobile ? (
    <FeedbackMobileSheet
      success={controller.success}
      rate={controller.rate}
      setRate={controller.setRate}
      detail={controller.detail}
      setDetail={controller.setDetail}
      error={controller.error}
      isPending={controller.isPending}
      onClose={controller.handleClose}
      onDontShowAgain={controller.handleDontShowAgain}
      onSubmit={controller.handleSubmit}
      titles={titles}
    />
  ) : (
    <FeedbackDesktopModal
      success={controller.success}
      rate={controller.rate}
      setRate={controller.setRate}
      detail={controller.detail}
      setDetail={controller.setDetail}
      error={controller.error}
      isPending={controller.isPending}
      onClose={controller.handleClose}
      onDontShowAgain={controller.handleDontShowAgain}
      onSubmit={controller.handleSubmit}
      titles={titles}
    />
  );
};

export default FeedbackModal;
