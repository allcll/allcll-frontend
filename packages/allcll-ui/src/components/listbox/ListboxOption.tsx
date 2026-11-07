import { forwardRef, type ComponentPropsWithoutRef, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { INTERACTION } from '../../config';

interface ListboxOptionProps extends Omit<ComponentPropsWithoutRef<'div'>, 'id'> {
  selected: boolean;
  onSelect?: () => void;
  left: ReactNode;
  right?: ReactNode;
  id?: string;
  active?: boolean;
  focusable?: boolean;
}

const ListboxOption = forwardRef<HTMLDivElement, ListboxOptionProps>(function ListboxOption(
  { selected = false, onSelect, left, right, id, active = false, focusable = true, onClick, ...rest },
  ref,
) {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    onSelect?.();
    onClick?.(e);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.currentTarget.click();
    }
  };

  const baseClass = `flex px-2 py-2 rounded-md cursor-pointer text-sm ${INTERACTION.pressable} ${INTERACTION.hoverable}`;

  return (
    <div
      {...rest}
      ref={ref}
      id={id}
      role="option"
      aria-selected={selected}
      tabIndex={focusable ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`${baseClass} ${getSelectedClass(selected, active)}`}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 min-w-0 break-keep">{left}</div>
        {right && <div className={`shrink-0 flex items-center ${selected ? '' : 'invisible'}`}>{right}</div>}
      </div>
    </div>
  );
});

function getSelectedClass(selected: boolean, active: boolean) {
  if (selected)
    return `text-primary-500 font-medium hover:bg-primary-100 ${active ? 'bg-primary-100' : 'bg-primary-50'}`;

  return `hover:bg-gray-50 text-gray-700 ${active ? 'bg-gray-50' : ''}`;
}

export default ListboxOption;
