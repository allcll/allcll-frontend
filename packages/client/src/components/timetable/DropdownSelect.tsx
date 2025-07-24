import React, { useState, useRef, useEffect } from 'react';

// 타입 정의
interface Option {
  id: string;
  label: string;
  editable?: boolean; // 수정 가능 여부
  deletable?: boolean; // 삭제 가능 여부
}

interface DropdownSelectProps {
  initialLabel: string;
  options: Option[];
  onSelect: (optionId: string) => void;
  onEdit?: (optionId: string) => void;
  onDelete?: (optionId: string) => void;
}

// Fixme : 기존에 있는 Chip 형태의 Selectbox 와 통합하기
const DropdownSelect: React.FC<DropdownSelectProps> = ({ initialLabel, options, onSelect, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(initialLabel);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedLabel(option.label);
    onSelect(option.id);
    setIsOpen(false);
  };

  const handleEditClick = (optionId: string) => {
    if (onEdit) {
      onEdit(optionId);
      setIsOpen(false); // 수정 후 드롭다운 닫기
    }
  };

  const handleDeleteClick = (optionId: string) => {
    if (onDelete) {
      onDelete(optionId);
      setIsOpen(false); // 삭제 후 드롭다운 닫기
    }
  };

  return (
    <div className="relative inline-block w-full max-w-sm" ref={dropdownRef}>
      {/* Select Box (보여지는 부분) */}
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-3 text-lg font-semibold text-blue-700 bg-blue-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 md:text-xl md:py-4"
        onClick={handleToggle}
      >
        <span>{selectedLabel}</span>
        <svg
          className={`w-5 h-5 text-blue-700 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu (숨겨진 부분) */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <div className="block px-4 py-2 text-lg font-semibold text-blue-700 border-b border-gray-200 md:text-xl">
              {initialLabel}
            </div>
            {options.map(option => (
              <div
                key={option.id}
                className="flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    checked={selectedLabel === option.label}
                    onChange={() => handleOptionClick(option)}
                  />
                  <span className="ml-3 text-base md:text-lg">{option.label}</span>
                </label>
                <div className="flex space-x-2 text-sm md:text-base">
                  {option.editable && (
                    <button
                      className="text-blue-500 hover:text-blue-700 font-medium"
                      onClick={() => handleEditClick(option.id)}
                    >
                      수정
                    </button>
                  )}
                  {option.deletable && (
                    <button
                      className="text-red-500 hover:text-red-700 font-medium"
                      onClick={() => handleDeleteClick(option.id)}
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownSelect;
