import { TimetableType } from '@/hooks/server/useTimetableSchedules';
import CheckboxAdapter from '@common/components/checkbox/CheckboxAdapter';
import Filtering from '@common/components/filtering/Filtering';
import SingleSelectFilterOption from '@common/components/filtering/SingleSelectFilter';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

interface ITimetableChip {
  timetables: TimetableType[];
  selectedTimetable: TimetableType;
  onSelect: (optionId: number) => void;
}

function TimetableChip({ selectedTimetable, onSelect, timetables }: ITimetableChip) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const setFilterScheduleWrapper = (field: string, value: string | number | null) => {
    if (field === 'selectedTimetable' && typeof value === 'number') {
      onSelect(value);
    }
  };

  const timetableOptions = timetables.map(timetable => {
    return {
      value: timetable.timeTableId,
      label: timetable.timeTableName,
    };
  });

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-left font-semibold text-sm sm:text-md">시간표를 선택해주세요.</h2>
      <div className="relative inline-block max-w-sm" ref={dropdownRef}>
        <Filtering label="시간표" selected={selectedTimetable.timeTableId !== null}>
          <SingleSelectFilterOption
            labelPrefix="시간표"
            selectedValue={selectedTimetable.timeTableId}
            field="selectedTimetable"
            setFilter={setFilterScheduleWrapper}
            options={timetableOptions}
            ItemComponent={CheckboxAdapter}
          />
        </Filtering>
        <Link to="/timetable" className="px-6 py-2 hover:text-blue-500 text-gray-500 rounded-md">
          새 시간표 추가
        </Link>
      </div>
    </div>
  );
}

export default TimetableChip;
