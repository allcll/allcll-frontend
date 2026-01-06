import { TimetableType } from '@/entities/timetable/api/useTimetableSchedules.ts';
import { Button, Label } from '@allcll/allcll-ui';
import CheckboxAdapter from '@/features/filtering/ui/CheckboxAdapter';
import Filtering from '@/features/filtering/ui/Filtering';
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
      <Label>시간표를 선택해주세요.</Label>
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
        <Button variant="text" size="small">
          <Link to="/timetable">+ 새 시간표 추가</Link>
        </Button>
      </div>
    </div>
  );
}

export default TimetableChip;
