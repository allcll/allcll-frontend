import type { ComponentProps } from 'react';
import { BottomSheet as BaseBottomSheet } from '@allcll/allcll-ui';
import useCloseBottomSheetOnBackKey from '@/widgets/bottomSheet/lib/useCloseBottomSheetOnBackKey';

function BottomSheet(props: ComponentProps<typeof BaseBottomSheet>) {
  useCloseBottomSheetOnBackKey(props.onClose);

  return <BaseBottomSheet {...props} />;
}

export default BottomSheet;
