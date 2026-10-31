import React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { HelpIcon } from '../../icons';
import { Z_INDEX } from '../../../zIndex';

interface ITooltip {
  children: React.ReactNode;
}

function Tooltip({ children }: ITooltip) {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger
        aria-label="도움말"
        className="flex rounded-md text-gray-400 transition-colors hover:text-gray-600 data-[state=open]:text-gray-600"
      >
        <HelpIcon className="w-4 h-4" />
      </RadixPopover.Trigger>

      <RadixPopover.Portal>
        <RadixPopover.Content
          side="top"
          sideOffset={8}
          collisionPadding={8}
          className="w-64 p-3 rounded bg-gray-900 text-white text-center outline-none"
          style={{ zIndex: Z_INDEX.popover }}
        >
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}

export default Tooltip;
