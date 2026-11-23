import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChatHelpIcon, SCROLLBAR_GAP_CLASS } from '@allcll/allcll-ui';
import useFeedbackStore from '../model/useFeedbackStore';
import { getFeedbackCategoryByPath } from '../lib/feedbackCategory';
import FeedbackModal from './FeedbackModal';

function FeedbackFab() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const isFeedbackOpen = useFeedbackStore(s => s.isFeedbackOpen);

  // 레이아웃에 붙어 있어 페이지가 바뀌어도 남으므로, 뒤로가기 등으로 이동하면 닫음
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {!isOpen && !isFeedbackOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-floating h-12 rounded-full pl-3.5 pr-5
                 bg-primary-500 text-white shadow-lg flex items-center gap-2
                 transition-colors duration-200 hover:bg-primary-600 ${SCROLLBAR_GAP_CLASS}`}
        >
          <ChatHelpIcon className="w-5 h-5 shrink-0" />
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
