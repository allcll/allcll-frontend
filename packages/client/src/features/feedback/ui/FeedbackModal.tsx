import FeedbackDesktopModal from '@/features/feedback/ui/FeedbackDesktopModal';
import FeedbackMobileSheet from '@/features/feedback/ui/FeedbackMobileSheet';
import useFeedbackModalController from '@/features/feedback/lib/useFeedbackModalController';
import FeedbackPeekBar from '@/features/feedback/ui/FeedbackPeekBar';
import type { FeedbackCategory } from '@/features/feedback/api/feedbackApi';
import type { FeedbackOpenMode } from '../lib/FeedbackTrigger';
import getFeedbackTitle from '../lib/getFeedbackTitle';
import useMobile from '@/shared/lib/useMobile';

interface IFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: FeedbackCategory;
  openMode?: FeedbackOpenMode;
  // 자동 노출을 억제하는 버튼, 사용자가 직접 여는 진입에서는 비활성화
  showDontShowAgain?: boolean;
  /**
   * true: 모달 안에 카테고리 칩을 보여주고 사용자가 바꿀 수 있습니다. (FAB)
   *       이때 category 는 처음 열었을 때 선택돼 있는 칩이고, 실제 제출값은 사용자가 최종 선택한 값입니다.
   * false: 칩 없이 category 가 그대로 제출됩니다. (졸업요건 결과 페이지)
   */
  selectableCategory?: boolean;
}

export const FeedbackModal = ({
  isOpen,
  onClose,
  category,
  openMode = 'auto',
  showDontShowAgain = true,
  selectableCategory = false,
}: IFeedbackModalProps) => {
  const isMobile = useMobile();
  /**
   * 모달에 표시할 문구 묶음 (제목, 평점 질문, 평점 라벨, 입력창 안내 등)
   * 카테고리 선택형(FAB)은 졸업요건 페이지에서 열어도 졸업요건 전용 문구("결과가 정확했나요?")가 아닌 공통 문구를 씁니다.
   */
  const titles = getFeedbackTitle(selectableCategory ? 'ALL' : category, openMode);
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
    category: controller.selectedCategory,
    onCategoryChange: selectableCategory ? controller.setSelectedCategory : undefined,
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
