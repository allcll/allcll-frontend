import React from 'react';

interface EssentialTagProps {
  className: string;
  essential: boolean;
  disabled: boolean;
  children?: React.ReactNode;
}

function EssentialTag({ className, essential, disabled, children }: EssentialTagProps) {
  const essentialColorClass = disabled
    ? 'before:border-t-[8px] before:border-t-gray-400 before:border-r-[8px] before:border-r-transparent '
    : 'before:border-t-[8px] before:border-t-red-500 before:border-r-[8px] before:border-r-transparent ';

  const divClassName =
    (essential
      ? 'relative inline-block w-auto' +
        "before:content-[''] before:absolute " +
        'before:top-0 before:left-0 before:w-0 before:h-0 before:z-5 ' +
        essentialColorClass
      : '') + className;

  return <div className={divClassName}>{children}</div>;
}

export default EssentialTag;
