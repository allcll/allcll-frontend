import { TimetableType } from '@/entities/timetable/api/useTimetableSchedules.ts';
import { Button, Chip, Flex, Grid, Label } from '@allcll/allcll-ui';
import { Link } from 'react-router-dom';

interface ITimetableChip {
  timetables: TimetableType[];
  selectedTimetable: TimetableType;
  onSelect: (optionId: number) => void;
}

function TimetableChip({ selectedTimetable, onSelect, timetables }: ITimetableChip) {
  const timeTableOptions = timetables.map(t => ({
    value: t.timeTableId,
    label: t.timeTableName,
  }));

  return (
    <Flex direction="flex-col" gap="gap-2">
      <Label>시간표를 선택해주세요.</Label>
      <Flex gap="gap-2">
        <Grid columns={{ sm: 2, md: 3 }} gap="gap-2" className="flex-1">
          {timeTableOptions.map(option => (
            <Chip
              key={option.value}
              label={option.label}
              selected={selectedTimetable.timeTableId === option.value}
              onClick={() => onSelect(option.value)}
            />
          ))}
        </Grid>

        <Button variant="text" size="small" textColor="gray">
          <Link to="/timetable">+ 새 시간표 추가</Link>
        </Button>
      </Flex>
    </Flex>
  );
}

export default TimetableChip;
