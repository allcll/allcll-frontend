import React, { useState, useRef } from 'react';
import Checkbox from '../common/Checkbox';
import Filtering from '../contentPanel/filter/Filtering';

// 타입 정의
interface Option {
  id: number;
  label: string;
  editable?: boolean;
  deletable?: boolean;
}

interface DropdownSelectProps {
  initialLabel: string;
  options: Option[];
  onSelect: (optionId: number) => void;
  onEdit?: (value: string, optionId: number) => void;
  onDelete?: (optionId: number) => void;
}

// Fixme : 기존에 있는 Chip 형태의 Selectbox 와 통합하기
const DropdownSelect: React.FC<DropdownSelectProps> = ({ initialLabel, options, onSelect, onEdit, onDelete }) => {
  const [selectedLabel, setSelectedLabel] = useState(initialLabel);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: Option) => {
    setSelectedLabel(option.label);
    onSelect(option.id);
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
    <div className="relative inline-block w-full max-w-sm mb-4" ref={dropdownRef}>
      {/* Select Box (보여지는 부분) */}
      <>
        <Filtering label={selectedLabel} selected={selectedLabel.length !== 0} className="gap-4">
          <h3 className="font-semiblod">{initialLabel}</h3>
          {options.map(option => (
            <div className="flex gap-5">
              <Checkbox
                key={option.id}
                label={option.label}
                isChecked={selectedLabel === option.label}
                onChange={() => handleOptionClick(option)}
              />
              {selectedLabel === option.label && (
                <div className="flex gap-4 text-sm">
                  <button
                    className="text-stone-500 text-sm hover:text-stone-600 font-medium cursor-pointer"
                    onClick={() => handleEditClick(option.id)}
                  >
                    수정
                  </button>
                  <button
                    className="text-red-500  text-sm  hover:text-red-600 font-medium cursor-pointer"
                    onClick={() => handleDeleteClick(option.id)}
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
