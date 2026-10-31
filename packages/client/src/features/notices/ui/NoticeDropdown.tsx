import { Popover, usePopoverContext } from '@allcll/allcll-ui';
import { type Notice } from '@/entities/notices/model/notice';
import NoticePanel from './NoticePanel';

interface NoticeDropdownProps {
  notices: Notice[];
  isRead: (notice: Notice) => boolean;
  onRead: (notice: Notice) => void;
  children: React.ReactNode;
}

// 패널에서 연 공지 상세 Dialog는 최상단 레이어에 따로 떠서, 그 안의 클릭, 포커스, Esc로 패널이 닫히지 않게 함
const keepOpenWhileDialog = (e: Event) => {
  if (document.querySelector('dialog[open]')) e.preventDefault();
};

function NoticeDropdown({ notices, isRead, onRead, children }: Readonly<NoticeDropdownProps>) {
  return (
    <Popover>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content
        align="end"
        layer="floating"
        className="w-120 h-120 flex flex-col overflow-hidden"
        onInteractOutside={keepOpenWhileDialog}
        onEscapeKeyDown={keepOpenWhileDialog}
      >
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
