import { RECENT_SEMESTERS } from '@/entities/semester/api/semester';
import useServiceSemester from '@/entities/semester/model/useServiceSemester';
import { TimetableType } from '@/entities/timetable/api/useTimetableSchedules.ts';
import { Button, Chip, Flex, Grid, Label } from '@allcll/allcll-ui';
import ImportantSvg from '@/assets/important.svg?react';
import { Link } from 'react-router-dom';

interface ITimetableChip {
  timetables: TimetableType[];
  selectedTimetable: TimetableType;
  onSelect: (optionId: number) => void;
}

function TimetableChip({ selectedTimetable, onSelect, timetables }: ITimetableChip) {
  const { data } = useServiceSemester();

  const currentSemester = data ?? RECENT_SEMESTERS;
  const semesterTimetables = timetables.filter(timetable => timetable.semesterCode === currentSemester.semesterCode);

  if (semesterTimetables.length === 0) {
    return <TimetableChipEmpty semesterValue={currentSemester.semesterValue} />;
  }

  return (
    <TimetableChipSelector
      semesterValue={currentSemester.semesterValue}
      timetables={semesterTimetables}
      selectedTimetableId={selectedTimetable.timeTableId}
      onSelect={onSelect}
    />
  );
}

interface ITimetableChipSelector {
  semesterValue?: string;
  timetables: TimetableType[];
  selectedTimetableId: number;
  onSelect: (optionId: number) => void;
}

function TimetableChipSelector({ semesterValue, timetables, selectedTimetableId, onSelect }: ITimetableChipSelector) {
  return (
    <Flex direction="flex-col" gap="gap-2">
      <Label>
        <span className="font-semibold">{semesterValue}학기</span> 시간표를 선택해주세요.
      </Label>

      <Flex gap="gap-2">
        <Grid columns={{ sm: 2, md: 3 }} gap="gap-2" className="flex-1">
          {timetables.map(t => (
            <Chip
              key={t.timeTableId}
              label={t.timeTableName}
              selected={selectedTimetableId === t.timeTableId}
              onClick={() => onSelect(t.timeTableId)}
            />
          ))}
        </Grid>

        <Button variant="text" size="small" textColor="primary">
          <Link to="/timetable">+ 새 시간표 추가</Link>
        </Button>
      </Flex>
    </Flex>
  );
}

function TimetableChipEmpty({ semesterValue }: { semesterValue?: string }) {
  return (
    <Flex direction="flex-col" gap="gap-4">
      <Label>시간표 선택</Label>

      <Flex direction="flex-col" gap="gap-2" align="items-center">
        <ImportantSvg className="w-7 h-7" fill="#C4C4C4" />
        <p className="text-gray-500 text-sm">{semesterValue}학기 시간표가 없어요.</p>
        <Button asChild variant="secondary" size="small">
          <Link to="/timetable">새 시간표 추가</Link>
        </Button>
      </Flex>
    </Flex>
  );
}

export default TimetableChip;
