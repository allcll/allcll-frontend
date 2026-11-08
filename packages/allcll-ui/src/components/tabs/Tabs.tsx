import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { TAB_FULL_WIDTH_CLASS, TAB_ITEM_CLASS, TAB_LIST_CLASS } from './tabStyles';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

function TabsRoot({ value, onValueChange, children, className }: TabsProps) {
  return (
    <RadixTabs.Root value={value} onValueChange={onValueChange} className={className}>
      {children}
    </RadixTabs.Root>
  );
}

interface TabsListProps extends Omit<ComponentPropsWithoutRef<typeof RadixTabs.List>, 'asChild'> {
  /** 탭을 가로로 가득 채울지 여부 */
  fullWidth?: boolean;
}

export function TabsList({ fullWidth = false, className = '', ...rest }: TabsListProps) {
  return (
    <RadixTabs.List {...rest} className={`${TAB_LIST_CLASS} ${fullWidth ? TAB_FULL_WIDTH_CLASS : ''} ${className}`} />
  );
}

function Tab({ className = '', ...rest }: ComponentPropsWithoutRef<typeof RadixTabs.Trigger>) {
  return (
    <RadixTabs.Trigger
      {...rest}
      className={`${TAB_ITEM_CLASS} data-[state=active]:border-primary-500 data-[state=active]:text-primary-500 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 ${className}`}
    />
  );
}

function TabsPanel({ className = '', ...rest }: ComponentPropsWithoutRef<typeof RadixTabs.Content>) {
  return <RadixTabs.Content {...rest} className={`outline-none ${className}`} />;
}

const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab,
  Panel: TabsPanel,
});

export default Tabs;
