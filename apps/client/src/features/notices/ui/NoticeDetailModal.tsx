import { Dialog } from '@allcll/allcll-ui';
import { type Notice } from '@/entities/notices/model/notice';
import NoticeDetailContent from './NoticeDetailContent';

interface NoticeDetailModalProps {
  notice: Notice;
  onClose: () => void;
}

function NoticeDetailModal({ notice, onClose }: Readonly<NoticeDetailModalProps>) {
  return (
    <Dialog title="공지사항" size="large" onClose={onClose}>
      <Dialog.Content className="sm:py-5">
        <NoticeDetailContent notice={notice} />
      </Dialog.Content>
    </Dialog>
  );
}

export default NoticeDetailModal;
