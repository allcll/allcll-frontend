import { useState } from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { usePopoverContext } from '../popover/Popover';
import { Z_INDEX } from '../../../../zIndex';

function PopoverContent({ children }: { children: React.ReactNode }) {
  const { triggerRef } = usePopoverContext();
  // 선택값이 트리거 라벨에 들어가 폭이 바뀌어도 팝오버가 출렁이지 않도록 열릴 때의 폭으로 고정
  const [minWidth] = useState(() => triggerRef.current?.getBoundingClientRect().width);

  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        align="start"
        sideOffset={8}
        collisionPadding={8}
        className="rounded-lg bg-white shadow-lg border border-gray-200 p-3 outline-none"
        style={{ zIndex: Z_INDEX.popover, minWidth }}
      >
        {children}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
}

export default PopoverContent;
