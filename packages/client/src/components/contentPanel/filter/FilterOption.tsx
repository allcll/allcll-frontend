interface IFilterOption {
  children: React.ReactNode;
  className?: string;
}

function FilterOption({ children, className = '' }: IFilterOption) {
  return (
    <div
      className={`absolute top-full mt-2 left-0 z-20 bg-white rounded-lg flex flex-col shadow-lg p-4 w-auto gap-1 min-w-max ${className}`}
      role="listbox"
    >
      {children}
    </div>
  );
}
export default FilterOption;
