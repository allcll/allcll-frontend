import { useRef, type ComponentProps } from 'react';
import { BottomSheet as BaseBottomSheet } from '@allcll/allcll-ui';
import useCloseBottomSheetOnBackKey from '@/widgets/bottomSheet/lib/useCloseBottomSheetOnBackKey';

function BottomSheet({ isOpen = true, title, children, ...props }: ComponentProps<typeof BaseBottomSheet>) {
  useCloseBottomSheetOnBackKey(isOpen, props.onClose);

  // 닫히는 애니메이션 동안 데이터가 비워져도 마지막으로 열려 있던 내용을 그대로 보여줌
  const lastOpened = useRef({ title, children });
  if (isOpen) lastOpened.current = { title, children };

  return (
    <BaseBottomSheet {...props} isOpen={isOpen} title={lastOpened.current.title}>
      {lastOpened.current.children}
    </BaseBottomSheet>
  );
}

export default Object.assign(BottomSheet, { Footer: BaseBottomSheet.Footer });
