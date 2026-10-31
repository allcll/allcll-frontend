import { Popover, usePopoverContext } from '@allcll/allcll-ui';
import { type Notice } from '@/entities/notices/model/notice';
import NoticePanel from './NoticePanel';

interface NoticeDropdownProps {
  notices: Notice[];
  isRead: (notice: Notice) => boolean;
  onRead: (notice: Notice) => void;
  children: React.ReactNode;
}

function NoticeDropdown({ notices, isRead, onRead, children }: Readonly<NoticeDropdownProps>) {
  return (
    <Popover>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content align="end" layer="floating" className="w-120 h-120 flex flex-col overflow-hidden">
        <NoticeDropdownPanel notices={notices} isRead={isRead} onRead={onRead} />
      </Popover.Content>
    </Popover>
  );
}

function NoticeDropdownPanel(props: Readonly<Omit<NoticeDropdownProps, 'children'>>) {
  const { close } = usePopoverContext();

  return <NoticePanel {...props} onClose={close} />;
}

export default NoticeDropdown;
