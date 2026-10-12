import type { ComponentPropsWithoutRef } from 'react';

interface ListboxProps extends ComponentPropsWithoutRef<'div'> {
  bordered?: boolean;
  className?: string;
}

function Listbox({ bordered = false, className = '', children, ...rest }: ListboxProps) {
  const borderClass = bordered ? 'rounded-md border border-gray-200' : '';

  return (
    <div
      role="listbox"
      {...rest}
      className={`min-h-0 overflow-y-auto p-1 [scrollbar-width:thin] [scrollbar-color:var(--color-gray-300)_transparent] ${borderClass} ${className}`}
    >
      {children}
    </div>
  );
}

export default Listbox;
