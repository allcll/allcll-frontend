import { Button, Dialog, Flex } from '@allcll/allcll-ui';
import type { Notice } from '@/hooks/server/useAdminNotices';
import { formatDate, OPERATION_TYPE_LABEL } from '@allcll/common';

interface INoticeDeleteModalProps {
  notice: Notice;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

function NoticeDeleteModal({ notice, onCancel, onConfirm, isDeleting }: INoticeDeleteModalProps) {
  return (
    <Dialog title="공지사항 삭제" onClose={onCancel}>
      <Dialog.Content>
        <Flex direction="column" gap={3}>
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-1 text-sm">
            <p className="font-medium line-clamp-2">{notice.title}</p>
            <p className="text-gray-500">
              {OPERATION_TYPE_LABEL[notice.operationType]} · {formatDate(notice.createdAt)}
            </p>
          </div>
          <p className="text-sm text-gray-600">이 공지사항을 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.</p>
        </Flex>
      </Dialog.Content>
      <Dialog.Footer>
        <Button variant="solid" color="gray" size="medium" onClick={onCancel} disabled={isDeleting}>
          취소
        </Button>
        <Button variant="solid" color="danger" size="medium" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? '삭제 중...' : '삭제하기'}
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export default NoticeDeleteModal;
