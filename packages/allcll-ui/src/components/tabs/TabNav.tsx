import type { ComponentPropsWithoutRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import {
  TAB_FULL_WIDTH_CLASS,
  TAB_ITEM_CLASS,
  TAB_LIST_CLASS,
  TAB_SELECTED_CLASS,
  TAB_UNSELECTED_CLASS,
} from './tabStyles';

interface TabNavProps extends ComponentPropsWithoutRef<'nav'> {
  fullWidth?: boolean;
}

function TabNavRoot({ fullWidth = false, className = '', ...rest }: TabNavProps) {
  return <nav {...rest} className={`${TAB_LIST_CLASS} ${fullWidth ? TAB_FULL_WIDTH_CLASS : ''} ${className}`} />;
}

interface TabNavItemProps extends ComponentPropsWithoutRef<'a'> {
  selected: boolean;
  asChild?: boolean;
}

export function TabNavItem({ selected, asChild = false, className = '', ...rest }: TabNavItemProps) {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      aria-current={selected ? 'page' : undefined}
      {...rest}
      className={`${TAB_ITEM_CLASS} ${selected ? TAB_SELECTED_CLASS : TAB_UNSELECTED_CLASS} ${className}`}
    />
  );
}

const TabNav = Object.assign(TabNavRoot, {
  Item: TabNavItem,
});

export default TabNav;
