import { TimetableType } from '@/entities/timetable/api/useTimetableSchedules.ts';
import CheckboxAdapter from '@common/components/checkbox/CheckboxAdapter.tsx';
import Filtering from '@common/components/filtering/Filtering.tsx';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

interface ITimetableChip {
  timetables: TimetableType[];
  selectedTimetable: TimetableType;
  onSelect: (optionId: number) => void;
}

function TimetableChip({ selectedTimetable, onSelect, timetables }: ITimetableChip) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const timeTableOptions = timetables.map(t => ({
    value: t.timeTableId,
    label: t.timeTableName,
  }));

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-left font-semibold text-sm sm:text-md">시간표를 선택해주세요.</h2>
      <div className="relative inline-block max-w-sm" ref={dropdownRef}>
        <Filtering
          label={selectedTimetable.timeTableName}
          selected={selectedTimetable.timeTableId !== null}
          className="min-w-max"
        >
          {timeTableOptions.map(option => (
            <CheckboxAdapter
              key={option.value}
              label={option.label}
              selected={selectedTimetable.timeTableId === option.value}
              onClick={() => onSelect(option.value)}
            />
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
