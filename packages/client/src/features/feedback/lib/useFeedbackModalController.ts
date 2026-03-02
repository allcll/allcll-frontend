import { useEffect, useRef, useState } from 'react';
import useFeedbackStore from '@/features/feedback/model/useFeedbackStore';
import useFeedbackMutation from '@/features/feedback/api/useFeedbackMutation';
import { useBottomSheetStore } from '@/shared/model/useBottomSheetStore';

type UseFeedbackModalControllerProps = {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  openMode?: 'auto' | 'manual';
};

export function useFeedbackModalController({
  isOpen,
  onClose,
  isMobile,
  openMode = 'auto',
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
      hasMountedFeedbackSheet.current = false;
      setRate(0);
      setDetail('');
      setSuccess(false);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isMobile) return;

    if (isOpen && openMode === 'manual') {
      openBottomSheet('feedback');
      return;
    }

    if (!isOpen) {
      closeBottomSheet('feedback');
    }
  }, [isMobile, isOpen, openMode, openBottomSheet, closeBottomSheet]);

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
    if (rate === 0) {
      setError('평점을 선택해주세요');
      setTimeout(() => setError(null), 3000);
      return;
    }

    mutate(
      { rate, detail: detail ?? '', operationType: 'GRADUATION' },
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
    handleSubmit,
    handleDontShowAgain,
    handleClose: closeFeedback,
    openSheet,
    isSheetOpen: bottomSheetType.feedback.isOpen,
  };
}

export default useFeedbackModalController;
