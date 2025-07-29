import { useRef } from 'react';
import Checkbox from '../common/Checkbox';
import Filtering from '../contentPanel/filter/Filtering';
import { TimetableType } from '@/hooks/server/useTimetableSchedules.ts';
import { useScheduleState } from '@/store/useScheduleState';

interface DropdownSelectProps {
  timetables: TimetableType[];
  onSelect: (optionId: number) => void;
  onEdit?: (value: string, optionId: number) => void;
  onDelete?: (optionId: number) => void;
  openCreateModal?: () => void;
}

// Fixme : 기존에 있는 Chip 형태의 Selectbox 와 통합하기
const DropdownSelect = ({ timetables, onSelect, onEdit, onDelete, openCreateModal }: DropdownSelectProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentTimetable = useScheduleState(state => state.currentTimetable);
  const setCurrentTimetable = useScheduleState(state => state.pickTimetable);

  const handleOptionClick = (option: TimetableType) => {
    setCurrentTimetable(option);
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
          label={currentTimetable?.timeTableName ?? '새 시간표'}
          selected={currentTimetable?.timeTableId > -1}
          className="gap-4 max-w-20 max-h-80 overflow-y-auto"
        >
          {timetables.length === 0 && <div> 새로운 시간표를 추가해주세요.</div>}
          {timetables.length !== 0 &&
            timetables.map(option => (
              <div className="flex gap-5" key={option.timeTableName + option.timeTableId}>
                <Checkbox
                  key={option.timeTableId}
                  label={option.timeTableName}
                  isChecked={currentTimetable.timeTableId === option.timeTableId}
                  onChange={() => handleOptionClick(option)}
                />
                {currentTimetable.timeTableId === option.timeTableId && (
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
          <button className="flex justify-center text-gray-500 text-sm hover:font-bold" onClick={openCreateModal}>
            + 시간표 추가하기
          </button>
        </Filtering>
      </>
    </div>
  );
};

export default DropdownSelect;
