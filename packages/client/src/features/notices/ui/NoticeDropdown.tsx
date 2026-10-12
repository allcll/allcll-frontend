import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { type Notice } from '@/entities/notices/model/notice';
import NoticePanel from './NoticePanel';

interface NoticeDropdownProps {
  notices: Notice[];
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  isRead: (notice: Notice) => boolean;
  onRead: (notice: Notice) => void;
  onClose: () => void;
}

function NoticeDropdown({ notices, isOpen, triggerRef, isRead, onRead, onClose }: Readonly<NoticeDropdownProps>) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      // 드롭다운에서 연 공지 상세 Dialog는 body에 떠 있어서, 그 안의 클릭은 바깥 클릭으로 보지 않음
      if ((e.target as Element).closest('dialog[open]')) return;
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen || !triggerRef.current) return null;

  const rect = triggerRef.current.getBoundingClientRect();

  return createPortal(
    <div
      ref={panelRef}
      className="fixed w-120 h-120 bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col z-floating"
      style={{
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      }}
    >
      <NoticePanel notices={notices} isRead={isRead} onRead={onRead} onClose={onClose} />
    </div>,
    document.body,
  );
}

export default NoticeDropdown;
