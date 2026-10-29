import { useRef } from 'react';
import { createPortal } from 'react-dom';
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

  // 헤더의 z-index에 갇히면 페이지의 FAB 등 floating UI 아래에 깔리므로 body에 렌더링
  return createPortal(
    <>
      <CSSTransition in={isOpen} timeout={300} classNames="mobile-menu-overlay" unmountOnExit nodeRef={overlayRef}>
        <div
          ref={overlayRef}
          className="fixed inset-0 z-overlay md:hidden bg-black/30"
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
          className="fixed top-0 right-0 h-full w-full bg-white shadow-lg z-floating md:hidden flex flex-col"
        >
          <NoticePanel notices={notices} isMobile isRead={isRead} onRead={onRead} onClose={onClose} />
        </div>
      </CSSTransition>
    </>,
    document.body,
  );
}

export default NoticeMobileView;
