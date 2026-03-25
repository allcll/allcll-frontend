import { format } from 'date-fns';
import { Button, Dialog, Flex } from '@allcll/allcll-ui';
import { CATEGORY_LABELS, type Notice } from '@/hooks/server/useAdminNotices';

interface Props {
  notice: Notice;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

function NoticeDeleteModal({ notice, onCancel, onConfirm, isDeleting }: Props) {
  return (
    <Dialog title="공지사항 삭제" onClose={onCancel}>
      <Dialog.Content>
        <Flex direction="flex-col" gap="gap-3">
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-1 text-sm">
            <p className="font-medium text-gray-900 line-clamp-2">{notice.title}</p>
            <p className="text-gray-500">
              {CATEGORY_LABELS[notice.category]} · {format(new Date(notice.createdAt), 'yyyy.MM.dd')}
            </p>
          </div>
          <p className="text-sm text-gray-600">이 공지사항을 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.</p>
        </Flex>
      </Dialog.Content>
      <Dialog.Footer>
        <Button variant="outlined" size="small" onClick={onCancel} disabled={isDeleting}>
          취소
        </Button>
        <Button variant="danger" size="small" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? '삭제 중...' : '삭제하기'}
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export default NoticeDeleteModal;
