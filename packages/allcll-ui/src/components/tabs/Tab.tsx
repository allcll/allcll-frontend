import type { ComponentPropsWithoutRef } from 'react';
import { Slot } from '@radix-ui/react-slot';

interface TabProps extends ComponentPropsWithoutRef<'button'> {
  selected: boolean;
  asChild?: boolean;
  className?: string;
}

function Tab({ selected, asChild = false, className = '', children, ...rest }: TabProps) {
  const Comp = asChild ? Slot : 'button';
  const stateClass = selected
    ? 'border-primary-500 text-primary-500'
    : 'border-transparent text-gray-500 hover:text-gray-700';

  return (
    <Comp
      role="tab"
      aria-selected={selected}
      {...(asChild ? {} : { type: 'button' as const })}
      {...rest}
      className={`px-4 py-2 -mb-px border-b-2 transition-colors ${stateClass} ${className}`}
    >
      {children}
    </Comp>
  );
}

export default Tab;
