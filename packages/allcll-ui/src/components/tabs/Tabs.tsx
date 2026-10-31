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
      className={`flex border-b border-gray-200 text-sm ${fullWidth ? '*:flex-1 *:text-center' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

const Tabs = Object.assign(TabsRoot, {
  Tab,
});

export default Tabs;
