import type { ComponentPropsWithoutRef } from 'react';
import Tab from './Tab';

interface TabsProps extends ComponentPropsWithoutRef<'div'> {
  fullWidth?: boolean;
  className?: string;
}

function TabsRoot({ fullWidth = false, className = '', children, ...rest }: TabsProps) {
  return (
    <div
      role="tablist"
      {...rest}
      className={`flex overflow-x-auto [scrollbar-width:none] [contain:inline-size] shadow-[inset_0_-1px_0_var(--color-gray-200)] text-sm ${fullWidth ? '*:flex-1 *:text-center' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

const Tabs = Object.assign(TabsRoot, {
  Tab,
});

export default Tabs;
