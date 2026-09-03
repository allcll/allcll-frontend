import { useEffect, useRef, useState } from 'react';
import useFeedbackStore from '@/features/feedback/model/useFeedbackStore';
import useFeedbackMutation from '@/features/feedback/api/useFeedbackMutation';
import { FeedbackCategory } from '@/features/feedback/api/feedbackApi';
import { useBottomSheetStore } from '@/shared/model/useBottomSheetStore';

type UseFeedbackModalControllerProps = {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  category: FeedbackCategory;
  // PeekBar를 거치지 않고 곧바로 바텀시트를 여는지 여부
  opensSheetDirectly: boolean;
};

export function useFeedbackModalController({
  isOpen,
  onClose,
  isMobile,
  category,
  opensSheetDirectly,
}: UseFeedbackModalControllerProps) {
  const hasMountedFeedbackSheet = useRef(false);
  const [rate, setRate] = useState<0 | 1 | 2 | 3>(0);
  const [detail, setDetail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dontShowAgain = useFeedbackStore(s => s.dontShowAgain);
  const setDontShowAgain = useFeedbackStore(s => s.setDontShowAgain);
  const bottomSheetType = useBottomSheetStore(state => state.type);
  const openBottomSheet = useBottomSheetStore(state => state.openBottomSheet);
  const closeBottomSheet = useBottomSheetStore(state => state.closeBottomSheet);

  const { mutate, isPending } = useFeedbackMutation();

  useEffect(() => {
    if (!isOpen) {
      initialize();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isMobile) return;

    if (isOpen && opensSheetDirectly) {
      openBottomSheet('feedback');
      return;
    }

    if (!isOpen) {
      closeBottomSheet('feedback');
    }
  }, [isMobile, isOpen, opensSheetDirectly, openBottomSheet, closeBottomSheet]);

  useEffect(() => {
    if (!isMobile) return;
    if (!isOpen) return;

    if (bottomSheetType.feedback.isOpen) {
      hasMountedFeedbackSheet.current = true;
      return;
    }

    if (hasMountedFeedbackSheet.current && !bottomSheetType.feedback.isOpen) {
      hasMountedFeedbackSheet.current = false;
      onClose();
    }
  }, [isMobile, isOpen, bottomSheetType.feedback.isOpen, onClose]);

  const initialize = () => {
    hasMountedFeedbackSheet.current = false;
    setRate(0);
    setDetail('');
    setSuccess(false);
    setError(null);
  };

  const closeFeedback = () => {
    hasMountedFeedbackSheet.current = false;
    if (isMobile) closeBottomSheet('feedback');
    onClose();
  };

  const openSheet = () => {
    if (!isMobile) return;
    openBottomSheet('feedback');
  };

  const handleSubmit = () => {
    if (rate === 0) return;

    mutate(
      { rate, detail: detail ?? '', operationType: category },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            closeFeedback();
          }, 2000);
        },
        onError: () => {
          setError('응답을 제출할 수 없습니다');
          setTimeout(() => setError(null), 5000);
        },
      },
    );
  };

  const handleDontShowAgain = () => {
    setDontShowAgain(true);
    closeFeedback();
  };

  return {
    dontShowAgain,
    rate,
    setRate,
    detail,
    setDetail,
    success,
    error,
    isPending,
    canSubmit: rate !== 0,
    handleSubmit,
    handleDontShowAgain,
    handleClose: closeFeedback,
    openSheet,
    isSheetOpen: bottomSheetType.feedback.isOpen,
  };
}

export default useFeedbackModalController;
