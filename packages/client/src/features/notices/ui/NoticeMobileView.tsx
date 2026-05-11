import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { type Notice } from '@/entities/notices/model/notice';
import { useBodyScrollLock } from '@/shared/lib/useBodyScrollLock';
import NoticePanel from './NoticePanel';

interface NoticeMobileViewProps {
  notices: Notice[];
  isOpen: boolean;
  isRead: (notice: Notice) => boolean;
  onRead: (notice: Notice) => void;
  onClose: () => void;
}

function NoticeMobileView({ notices, isOpen, isRead, onRead, onClose }: Readonly<NoticeMobileViewProps>) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(isOpen);

  return (
    <>
      <CSSTransition in={isOpen} timeout={300} classNames="mobile-menu-overlay" unmountOnExit nodeRef={overlayRef}>
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 md:hidden bg-black/30"
          aria-hidden="true"
          onClick={onClose}
        />
      </CSSTransition>

      <CSSTransition in={isOpen} timeout={300} classNames="mobile-menu" unmountOnExit nodeRef={panelRef}>
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="공지사항"
          className="fixed top-0 right-0 h-full w-full bg-white shadow-lg z-50 md:hidden flex flex-col"
        >
          <NoticePanel notices={notices} isMobile isRead={isRead} onRead={onRead} onClose={onClose} />
        </div>
      </CSSTransition>
    </>
  );
}

export default NoticeMobileView;
