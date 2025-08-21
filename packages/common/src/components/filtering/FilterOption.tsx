import React, { RefObject } from 'react';

interface IFilterOption {
  children: React.ReactNode;
  className?: string;
  contentRef: RefObject<HTMLDivElement | null>;
}

function FilterOption({ children, contentRef, className = '' }: IFilterOption) {
  return (
    <div
      ref={contentRef}
      className={`absolute left-0 top-full mt-2 z-20
  flex flex-col gap-1
  rounded-lg border border-gray-200 bg-white shadow-lg
  p-2
  max-h-64 overflow-y-auto
  ${className ? className : 'min-w-[150px]'}
  `}
      role="listbox"
    >
      {children}
    </div>
  );
}
export default FilterOption;
