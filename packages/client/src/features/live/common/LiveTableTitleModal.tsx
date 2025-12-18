import { Dialog } from '@allcll/allcll-ui';
import DraggableList from './DraggableList';
import useBackSignal from '@/shared/lib/useBackSignal';
import { HeadTitle } from '@/store/useTableColumnStore';

interface ITableTitleModal<T> {
  initialItems: HeadTitle<T>[];
  onChange: (items: HeadTitle<T>[]) => void;
  onClose: () => void;
}

function LiveTableTitleModal<T>({ initialItems, onChange, onClose }: ITableTitleModal<T>) {
  useBackSignal({
    enabled: true,
    onClose: onClose,
  });

  return (
    <Dialog title="테이블 설정" onClose={onClose} isOpen>
      <Dialog.Content>
        <DraggableList initialItems={initialItems} onChange={onChange} />
      </Dialog.Content>
    </Dialog>
  );
}

export default LiveTableTitleModal;
