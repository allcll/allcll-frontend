import { useRef, useState } from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { usePopoverContext } from '../popover/Popover';
import { Z_INDEX, type ZIndexLayer } from '../../../../zIndex';

type PopoverContentProps = Pick<RadixPopover.PopoverContentProps, 'align' | 'onInteractOutside' | 'onEscapeKeyDown'> & {
  children: React.ReactNode;
  className?: string;
  layer?: ZIndexLayer;
};

function PopoverContent({
  children,
  className = 'p-3',
  align = 'start',
  layer = 'popover',
  ...rest
}: PopoverContentProps) {
  const { triggerRef } = usePopoverContext();
  // 선택값이 트리거 라벨에 들어가 폭이 바뀌어도 팝오버가 출렁이지 않도록 열릴 때의 폭으로 고정
  const [minWidth] = useState(() => triggerRef.current?.getBoundingClientRect().width);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        ref={contentRef}
        // 첫 선택지에 포커스 테두리가 생겨 선택된 것처럼 보이지 않도록 상자 자체에 포커스
        onOpenAutoFocus={e => {
          e.preventDefault();
          contentRef.current?.focus();
        }}
        align={align}
        sideOffset={8}
        collisionPadding={8}
        className={`rounded-lg bg-white shadow-lg border border-gray-200 outline-none ${className}`}
        style={{ zIndex: Z_INDEX[layer], minWidth }}
        {...rest}
      >
        {children}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
}

export default PopoverContent;
