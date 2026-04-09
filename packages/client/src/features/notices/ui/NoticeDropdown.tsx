import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { type Notice } from '@/entities/notices/model';
import NoticePanel from './NoticePanel';

interface NoticeDropdownProps {
  notices: Notice[];
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  isRead: (id: number) => boolean;
  onRead: (id: number) => void;
  onClose: () => void;
}

function NoticeDropdown({ notices, isOpen, triggerRef, isRead, onRead, onClose }: Readonly<NoticeDropdownProps>) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
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
      className="fixed w-120 h-120 bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col z-50"
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
