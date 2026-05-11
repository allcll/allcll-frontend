import { useRef, useState, useCallback } from 'react';

const MOBILE_BREAKPOINT = 768;
import AlarmSvg from '@/assets/alarm.svg?react';
import { useNotices } from '@/entities/notices/api/useNotices';
import { useNoticeRead } from '../lib/useNoticeRead';
import NoticeDropdown from './NoticeDropdown';
import NoticeMobileView from './NoticeMobileView';

function NoticeBell() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { data: notices = [] } = useNotices();
  const { isRead, markAsRead } = useNoticeRead();

  const hasNew = notices.some(n => !isRead(n));

  const toggle = () => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    setIsOpen(prev => !prev);
  };
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-label="공지사항"
        className="relative p-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        <AlarmSvg className="w-4 h-4 text-gray-600" />
        {hasNew && (
          <span className="absolute -top-0.5 -right-0.5 h-4 px-1 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            N
          </span>
        )}
      </button>

      {!isMobile && (
        <NoticeDropdown
          notices={notices}
          isOpen={isOpen}
          triggerRef={triggerRef}
          isRead={isRead}
          onRead={markAsRead}
          onClose={close}
        />
      )}

      {isMobile && (
        <NoticeMobileView notices={notices} isOpen={isOpen} isRead={isRead} onRead={markAsRead} onClose={close} />
      )}
    </>
  );
}

export default NoticeBell;
