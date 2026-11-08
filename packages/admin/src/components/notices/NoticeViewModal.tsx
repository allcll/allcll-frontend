import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Button, Dialog, Flex, Heading } from '@allcll/allcll-ui';
import OperationTypeBadge from '@/components/common/OperationTypeBadge';
import type { Notice } from '@/hooks/server/useAdminNotices';
import { formatDate } from '@allcll/common';

interface INoticeViewModalProps {
  notice: Notice;
  onClose: () => void;
  onEdit: () => void;
}

function NoticeViewModal({ notice, onClose, onEdit }: INoticeViewModalProps) {
  return (
    <Dialog title="공지사항" onClose={onClose}>
      <Dialog.Content className="sm:py-5">
        <Flex direction="column" gap={4} className="w-160 max-w-full">
          <Flex direction="column" gap={2} className="pb-4 border-b border-gray-100">
            <Heading level={3}>{notice.title}</Heading>
            <Flex align="center" gap={2} className="text-xs text-gray-500">
              <OperationTypeBadge operationType={notice.operationType} />
              <span>작성 {formatDate(notice.createdAt)}</span>
              {formatDate(notice.updatedAt) !== formatDate(notice.createdAt) && (
                <span className="text-gray-400">· 수정 {formatDate(notice.updatedAt)}</span>
              )}
            </Flex>
          </Flex>
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{notice.content}</ReactMarkdown>
          </div>
        </Flex>
      </Dialog.Content>
      <Dialog.Footer>
        <Button variant="solid" color="gray" size="medium" onClick={onClose}>
          닫기
        </Button>
        <Button variant="solid" size="medium" onClick={onEdit}>
          수정하기
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export default NoticeViewModal;
