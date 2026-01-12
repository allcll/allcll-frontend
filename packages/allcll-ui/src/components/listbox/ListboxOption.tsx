import type { ReactNode, KeyboardEvent } from 'react';
import RowSlots from '../row/RowSlots';
import { INTERACTION } from '../../config';

interface ListboxOptionProps {
  selected: boolean;
  onSelect?: () => void;
  left: ReactNode;
  right?: ReactNode;
}

function ListboxOption({ selected = false, onSelect, left, right }: ListboxOptionProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.();
    }
  };

  const baseClass = `flex px-2 py-2 rounded-sm cursor-pointer text-sm ${INTERACTION.pressable} ${INTERACTION.hoverable}`;

  return (
    <div
      role="option"
      aria-selected={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={`${baseClass} ${getSelectedClass(selected)}`}
    >
      <RowSlots left={<div className="flex items-center">{left}</div>} right={selected ? right : null} />
    </div>
  );
}

function getSelectedClass(selected: boolean) {
  return selected ? 'bg-blue-50 text-blue-500 font-medium hover:bg-blue-100' : 'hover:bg-gray-50 text-gray-700';
}

export default ListboxOption;
