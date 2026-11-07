import { useState } from 'react';
import { Popover } from '@allcll/allcll-ui';
import { type Notice } from '@/entities/notices/model/notice';
import NoticePanel from './NoticePanel';

interface NoticeDropdownProps {
  notices: Notice[];
  isRead: (notice: Notice) => boolean;
  onRead: (notice: Notice) => void;
  children: React.ReactNode;
}

function NoticeDropdown({ notices, isRead, onRead, children }: Readonly<NoticeDropdownProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content align="end" layer="floating" className="w-120 h-120 flex flex-col overflow-hidden">
        <NoticePanel notices={notices} isRead={isRead} onRead={onRead} onClose={() => setIsOpen(false)} />
      </Popover.Content>
    </Popover>
  );
}

export default NoticeDropdown;
