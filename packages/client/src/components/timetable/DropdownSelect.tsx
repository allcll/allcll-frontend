import React, { useState, useRef } from 'react';
import Checkbox from '../common/Checkbox';
import Filtering from '../contentPanel/filter/Filtering';
import { TimetableType } from '@/hooks/server/useTimetableData';

interface DropdownSelectProps {
  currentTimetable: TimetableType;
  timetables: TimetableType[];
  onSelect: (optionId: number) => void;
  onEdit?: (value: string, optionId: number) => void;
  onDelete?: (optionId: number) => void;
}

// Fixme : 기존에 있는 Chip 형태의 Selectbox 와 통합하기
const DropdownSelect: React.FC<DropdownSelectProps> = ({
  currentTimetable,
  timetables,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [selectedOption, setSelectedOption] = useState(currentTimetable);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: TimetableType) => {
    setSelectedOption(option);
    onSelect(option.timeTableId);
  };

  const handleEditClick = (optionId: number) => {
    if (onEdit) {
      onEdit('', optionId);
    }
  };

  const handleDeleteClick = (optionId: number) => {
    if (onDelete) {
      onDelete(optionId);
    }
  };

  return (
    <div className="relative inline-block w-full max-w-sm" ref={dropdownRef}>
      {/* Select Box (보여지는 부분) */}
      <>
        <Filtering
          label={selectedOption.timeTableName ?? '학기 선택'}
          selected={selectedOption.timeTableId !== -1}
          className="gap-4"
        >
          <h3 className="font-semiblod">{selectedOption.timeTableName}</h3>
          {timetables.map(option => (
            <div className="flex gap-5">
              <Checkbox
                key={option.timeTableId}
                label={option.timeTableName}
                isChecked={selectedOption.timeTableId === option.timeTableId}
                onChange={() => handleOptionClick(option)}
              />
              {selectedOption.timeTableId === option.timeTableId && (
                <div className="flex gap-4 text-sm">
                  <button
                    className="text-stone-500 text-sm hover:text-stone-600 font-medium cursor-pointer"
                    onClick={() => handleEditClick(option.timeTableId)}
                  >
                    수정
                  </button>
                  <button
                    className="text-red-500  text-sm  hover:text-red-600 font-medium cursor-pointer"
                    onClick={() => handleDeleteClick(option.timeTableId)}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))}
        </Filtering>
      </>
    </div>
  );
};

export default DropdownSelect;
