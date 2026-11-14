import React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { HelpIcon } from '../../icons';
import { Z_INDEX, type ZIndexLayer } from '../../../zIndex';

interface ITooltip {
  children: React.ReactNode;
  layer?: ZIndexLayer;
}

function Tooltip({ children, layer = 'popover' }: ITooltip) {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger
        aria-label="도움말"
        className="flex rounded-md text-fg-subtle transition-colors hover:text-fg-muted data-[state=open]:text-fg-muted"
      >
        <HelpIcon className="w-4 h-4" />
      </RadixPopover.Trigger>

      <RadixPopover.Portal>
        <RadixPopover.Content
          side="top"
          sideOffset={8}
          collisionPadding={8}
          className="w-64 p-3 rounded bg-gray-900 text-white text-center outline-none"
          style={{ zIndex: Z_INDEX[layer] }}
        >
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}

export default Tooltip;
