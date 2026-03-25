import AlertTriangleSvg from '@/assets/alert-triangle.svg?react';
import { Button, Dialog, Flex } from '@allcll/allcll-ui';

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}

function UnsavedModal({ onCancel, onConfirm }: Props) {
  return (
    <Dialog title="저장되지 않은 변경사항" onClose={onCancel}>
      <Dialog.Content>
        <Flex gap="gap-3">
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
            <AlertTriangleSvg className="w-5 h-5 text-amber-500" />
          </div>
          <Flex direction="flex-col" gap="gap-1">
            <p className="text-sm font-medium text-gray-800">작성 중인 내용이 있습니다.</p>
            <p className="text-sm text-gray-500">페이지를 나가면 작성 중인 내용이 사라집니다. 계속 하시겠습니까?</p>
          </Flex>
        </Flex>
      </Dialog.Content>
      <Dialog.Footer>
        <Button variant="primary" size="small" onClick={onCancel}>
          계속 작성
        </Button>
        <Button variant="outlined" size="small" onClick={onConfirm}>
          나가기
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export default UnsavedModal;
