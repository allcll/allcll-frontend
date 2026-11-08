import { useEffect, useRef, useState } from 'react';
import useFeedbackStore from '@/features/feedback/model/useFeedbackStore';
import useFeedbackMutation from '@/features/feedback/api/useFeedbackMutation';
import type { FeedbackCategory } from '@/features/feedback/api/feedbackApi';
import { useOverlayStore } from '@/shared/model/useOverlayStore';
import { toPublicFeedbackCategory } from './feedbackCategory';

interface IUseFeedbackModalControllerProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  category: FeedbackCategory;
  // PeekBar를 거치지 않고 곧바로 바텀시트를 여는지 여부
  opensSheetDirectly: boolean;
  // 사용자가 카테고리를 직접 고를 수 있는지 여부
  selectableCategory: boolean;
}

export function useFeedbackModalController({
  isOpen,
  onClose,
  isMobile,
  category,
  opensSheetDirectly,
  selectableCategory,
}: IUseFeedbackModalControllerProps) {
  const hasMountedFeedbackSheet = useRef(false);
  const [rate, setRate] = useState<0 | 1 | 2 | 3>(0);
  const [detail, setDetail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory>(category);

  const dontShowAgain = useFeedbackStore(s => s.dontShowAgain);
  const setDontShowAgain = useFeedbackStore(s => s.setDontShowAgain);
  const setIsFeedbackOpen = useFeedbackStore(s => s.setIsFeedbackOpen);
  const overlays = useOverlayStore(state => state.type);
  const openOverlay = useOverlayStore(state => state.openOverlay);
  const closeOverlay = useOverlayStore(state => state.closeOverlay);

  const { mutate, isPending } = useFeedbackMutation();

  useEffect(() => {
    if (!isOpen) {
      initialize();
    }
  }, [isOpen, category]);

  useEffect(() => {
    if (!isOpen) return;

    setIsFeedbackOpen(true);
    return () => setIsFeedbackOpen(false);
  }, [isOpen, setIsFeedbackOpen]);

  useEffect(() => {
    if (!isMobile) return;

    if (isOpen && opensSheetDirectly) {
      openOverlay('feedback');
      return;
    }

    if (!isOpen) {
      closeOverlay('feedback');
    }
  }, [isMobile, isOpen, opensSheetDirectly, openOverlay, closeOverlay]);

  useEffect(() => {
    if (!isMobile) return;
    if (!isOpen) return;

    if (overlays.feedback.isOpen) {
      hasMountedFeedbackSheet.current = true;
      return;
    }

    if (hasMountedFeedbackSheet.current && !overlays.feedback.isOpen) {
      hasMountedFeedbackSheet.current = false;
      onClose();
    }
  }, [isMobile, isOpen, overlays.feedback.isOpen, onClose]);

  const initialize = () => {
    hasMountedFeedbackSheet.current = false;
    setRate(0);
    setDetail('');
    setSuccess(false);
    setError(null);
    setSelectedCategory(category);
  };

  const closeFeedback = () => {
    hasMountedFeedbackSheet.current = false;
    if (isMobile) closeOverlay('feedback');
    onClose();
  };

  const openSheet = () => {
    if (!isMobile) return;
    openOverlay('feedback');
  };

  const handleSubmit = () => {
    if (rate === 0) return;

    const operationType = selectableCategory ? toPublicFeedbackCategory(selectedCategory) : selectedCategory;

    mutate(
      { rate, detail: detail ?? '', operationType },
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
    selectedCategory,
    setSelectedCategory,
    success,
    error,
    isPending,
    canSubmit: rate !== 0,
    handleSubmit,
    handleDontShowAgain,
    handleClose: closeFeedback,
    openSheet,
    isSheetOpen: overlays.feedback.isOpen,
  };
}

export default useFeedbackModalController;
