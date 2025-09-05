import React, { RefObject } from 'react';

interface IFilterOption {
  children: React.ReactNode;
  isChipOpen: boolean;
  className?: string;
  contentRef: RefObject<HTMLDivElement | null>;
}

function FilterOption({ children, contentRef, className = '', isChipOpen }: IFilterOption) {
  if (!isChipOpen) return null;

  return (
    <div
      ref={contentRef}
      className={`
        absolute left-0 top-full mt-2 z-20
        flex flex-col gap-1 rounded-lg border border-gray-200 bg-white shadow-lg
        overflow-hidden p-4
        min-w-[150px]
        transform origin-top
        transition-all duration-300 [cubic-bezier(0.22,1,0.36,1)]
        opacity-100 scale-y-100
        ${className}
      `}
      role="listbox"
    >
      {children}
    </div>
  );
}

export default FilterOption;
