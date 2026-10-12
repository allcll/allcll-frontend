import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Badge, Dialog, Flex } from '@allcll/allcll-ui';
import { type Notice, getNoticeLabel } from '@/entities/notices/model/notice';

interface NoticeDetailModalProps {
  notice: Notice;
  onClose: () => void;
}

function NoticeDetailModal({ notice, onClose }: Readonly<NoticeDetailModalProps>) {
  const date = notice.createdAt.slice(0, 10).replace(/-/g, '.');

  return (
    <Dialog title={notice.title} size="large" onClose={onClose}>
      <Dialog.Content>
        <Flex align="items-center" gap="gap-2">
          <Badge variant="primary" size="small">
            {getNoticeLabel(notice.operationType)}
          </Badge>
          <span className="text-xs text-gray-400">{date}</span>
        </Flex>
        <div className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{notice.content}</ReactMarkdown>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}

export default NoticeDetailModal;
