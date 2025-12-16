import type { ComponentPropsWithRef } from 'react';
import EssentialTag from './EssentialTag.tsx';

interface SelectProps extends ComponentPropsWithRef<'select'> {
  essential?: boolean;
}

function Select({ className = '', essential = false, children, ...props }: SelectProps) {
  const classNames =
    'px-2 h-6 text-gray-400 text-xs border border-gray-300 ' +
    'disabled:bg-gray-100 disabled:cursor-not-allowed ' +
    className;

  return (
    <EssentialTag className={className} essential={essential} disabled={props.disabled ?? false}>
      <select className={classNames} {...props}>
        {children}
      </select>
    </EssentialTag>
  );
}

export default Select;
