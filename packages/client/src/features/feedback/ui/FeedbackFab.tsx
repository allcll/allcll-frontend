import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import HelpChatSvg from '@/assets/chat-help.svg?react';
import useFeedbackStore from '../model/useFeedbackStore';
import { getFeedbackCategoryByPath } from '../lib/feedbackCategory';
import FeedbackModal from './FeedbackModal';

function FeedbackFab() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  // 졸업요건 결과처럼 페이지 자체 피드백 모달이 열려 있으면 FAB를 숨깁니다.
  const isFeedbackOpen = useFeedbackStore(s => s.isFeedbackOpen);

  return (
    <>
      {!isOpen && !isFeedbackOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-floating h-12 rounded-full pl-3.5 pr-5
                 bg-primary-500 text-white shadow-lg flex items-center gap-2 cursor-pointer
                 transition-colors duration-200 hover:bg-primary-600"
        >
          {/* TODO: 아이콘 마이그레이션 시 정리 */}
          <HelpChatSvg className="w-6 h-6 shrink-0 [&_path]:fill-white" />
          <span className="text-sm font-semibold whitespace-nowrap">의견 보내기</span>
        </button>
      )}

      <FeedbackModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        category={getFeedbackCategoryByPath(pathname)}
        openMode="manual"
        showDontShowAgain={false}
        selectableCategory
      />
    </>
  );
}

export default FeedbackFab;
