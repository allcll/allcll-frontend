import type { ReactNode, KeyboardEvent } from 'react';
import RowSlots from '../row/RowSlots';
import { INTERACTION } from '../../config';

interface ListboxOptionProps {
  selected: boolean;
  onSelect?: () => void;
  left: ReactNode;
  right?: ReactNode;
  id?: string;
  active?: boolean;
  focusable?: boolean;
}

function ListboxOption({
  selected = false,
  onSelect,
  left,
  right,
  id,
  active = false,
  focusable = true,
}: ListboxOptionProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.();
    }
  };

  const baseClass = `flex px-2 py-2 rounded-sm cursor-pointer text-sm ${INTERACTION.pressable} ${INTERACTION.hoverable}`;

  return (
    <div
      id={id}
      role="option"
      aria-selected={selected}
      tabIndex={focusable ? 0 : -1}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={`${baseClass} ${getSelectedClass(selected, active)}`}
    >
      <RowSlots left={<div className="flex items-center">{left}</div>} right={selected ? right : null} />
    </div>
  );
}

function getSelectedClass(selected: boolean, active: boolean) {
  if (selected)
    return `text-primary-500 font-medium hover:bg-primary-100 ${active ? 'bg-primary-100' : 'bg-primary-50'}`;

  return `hover:bg-gray-50 text-gray-700 ${active ? 'bg-gray-50' : ''}`;
}

export default ListboxOption;
