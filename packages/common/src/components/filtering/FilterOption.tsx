import React, { RefObject } from 'react';

interface IFilterOption {
  children: React.ReactNode;
  isChipOpen: boolean;
  className?: string;
  contentRef: RefObject<HTMLDivElement | null>;
}

function FilterOption({ children, contentRef, className = '', isChipOpen }: IFilterOption) {
  return (
    <div
      ref={contentRef}
      className={`absolute left-0 top-full mt-2 z-20
        flex flex-col gap-1 rounded-lg border border-gray-200 bg-white shadow-lg
        overflow-hidden bg-white p-4
        shadow-lg
        transition-all duration-300 ease-in-out 2s
        ${className ? className : 'min-w-[150px]'}
        ${isChipOpen ? 'visible' : 'hidden'}
      `}
      role="listbox"
    >
      {children}
    </div>
  );
}
export default FilterOption;
