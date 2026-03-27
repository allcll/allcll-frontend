import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Button, Dialog, Badge, Flex } from '@allcll/allcll-ui';
import { CATEGORY_LABELS, type Notice } from '@/hooks/server/useAdminNotices';

interface Props {
  notice: Notice;
  onClose: () => void;
  onEdit: () => void;
}

function NoticeViewModal({ notice, onClose, onEdit }: Props) {
  return (
    <Dialog title={notice.title} onClose={onClose}>
      <Dialog.Content>
        <Flex direction="flex-col" gap="gap-4" className="w-[640px] max-w-full">
          <Flex align="items-center" gap="gap-2" className="text-xs text-gray-500">
            <Badge variant="primary" size="small">
              {CATEGORY_LABELS[notice.category]}
            </Badge>
            <span>{notice.createdAt.slice(0, 10).replace(/-/g, '.')}</span>
          </Flex>
          <div className="prose max-w-none max-h-[60vh] overflow-y-auto pr-1">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{notice.content}</ReactMarkdown>
          </div>
        </Flex>
      </Dialog.Content>
      <Dialog.Footer>
        <Button variant="outlined" size="small" onClick={onClose}>
          닫기
        </Button>
        <Button variant="primary" size="small" onClick={onEdit}>
          수정하기
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export default NoticeViewModal;
