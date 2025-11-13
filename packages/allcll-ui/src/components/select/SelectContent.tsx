import PopoverContent from '../popover/popover-content/PopoverContent';

function SelectContent({ children }: { children: React.ReactNode }) {
  return (
    <PopoverContent>
      <div role="listbox" aria-orientation="vertical" tabIndex={0}>
        {children}
      </div>
    </PopoverContent>
  );
}

export default SelectContent;
