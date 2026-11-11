import type { ReactNode } from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import Chip from '../../chip/Chip';
import { usePopoverContext } from '../popover/PopoverContext';

interface IPopoverTrigger {
  /** 선택 칩에 보일 문구 */
  label?: string;
  /** 선택 상태 */
  selected?: boolean;
  /** 칩 대신 쓸 트리거 요소 */
  children?: ReactNode;
}

function PopoverTrigger({ label = '', selected, children }: IPopoverTrigger) {
  const { isOpen, triggerRef } = usePopoverContext();

  return (
    <RadixPopover.Anchor asChild>
      <span className="inline-flex">
        <RadixPopover.Trigger asChild ref={triggerRef}>
          {children ?? (
            <Chip type="button" label={label} isOpen={isOpen} variant="select" selected={selected ?? false} />
          )}
        </RadixPopover.Trigger>
      </span>
    </RadixPopover.Anchor>
  );
}

export default PopoverTrigger;
