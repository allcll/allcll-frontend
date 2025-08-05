import Checkbox from '@/components/common/Checkbox';
import Filtering from '@/components/contentPanel/filter/Filtering';
import { TimetableType } from '@/hooks/server/useTimetableSchedules';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

interface ITimetableChip {
  timetables: TimetableType[];
  selectedTimetable: TimetableType;
  onSelect: (optionId: number) => void;
  setSelectedTimetable: React.Dispatch<React.SetStateAction<TimetableType>>;
}

function TimetableChip({ selectedTimetable, onSelect, setSelectedTimetable, timetables }: ITimetableChip) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: TimetableType) => {
    setSelectedTimetable(option);
    onSelect(option.timeTableId);
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-left font-semibold text-sm sm:text-md">시간표를 선택해주세요.</h2>
      <div className="relative inline-block max-w-sm" ref={dropdownRef}>
        <Filtering
          label={selectedTimetable?.timeTableName ?? '시간표를 선택해주세요.'}
          selected={selectedTimetable?.timeTableId !== -1}
          className="gap-4 max-h-80 overflow-y-auto"
        >
          {timetables.length === 0 && <div> 새로운 시간표를 추가해주세요.</div>}
          {timetables.length !== 0 &&
            timetables.map(option => (
              <div className="flex gap-5" key={option.timeTableName + option.timeTableId}>
                <Checkbox
                  key={option.timeTableId}
                  label={option.timeTableName}
                  isChecked={selectedTimetable.timeTableId === option.timeTableId}
                  onChange={() => handleOptionClick(option)}
                />
              </div>
            ))}
        </Filtering>

        <Link to="/timetable" className="px-6 py-2 hover:text-blue-500 text-gray-500 rounded-md">
          새 시간표 추가
        </Link>
      </div>
    </div>
  );
}

export default TimetableChip;
