import { useState } from 'react';
import HelpChatSvg from '@/assets/chat-help.svg?react';
import FeedbackModal from './FeedbackModal';
import { FeedbackCategory } from '../api/feedbackApi';

interface FeedbackFabProps {
  category: FeedbackCategory;
}

function FeedbackFab({ category }: Readonly<FeedbackFabProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-floating h-12 rounded-full pl-3.5 pr-5
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
        category={category}
        openMode="manual"
        showDontShowAgain={false}
      />
    </>
  );
}

export default FeedbackFab;
