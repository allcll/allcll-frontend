import { RefObject } from 'react';

interface IFilterOption {
  children: React.ReactNode;
  className?: string;
  contentRef: RefObject<HTMLDivElement | null>;
}

function FilterOption({ children, contentRef, className = '' }: IFilterOption) {
  return (
    <div
      ref={contentRef}
      className={`absolute top-full border border-gray-200 mt-2 left-0 z-20 bg-white rounded-lg flex flex-col shadow-lg p-2 w-auto gap-1 min-w-max ${className}`}
      role="listbox"
    >
      {children}
    </div>
  );
}
export default FilterOption;
