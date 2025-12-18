import React, { useEffect, useState } from 'react';
import Chip from '@common/components/chip/Chip.tsx';
import {
  useCreateTimetable,
  useDeleteTimetable,
  useUpdateTimetable,
} from '@/entities/timetable/api/useTimetableSchedules.ts';
import { useScheduleState } from '@/features/timetable/model/useScheduleState.ts';
import { Button, Dialog, Grid, Label, TextField } from '@allcll/allcll-ui';
import { SEMESTERS, SERVICE_SEMESTER_DUMMY } from '@/entities/semester/api/useServiceSemester.ts';

interface IEditTimetable {
  onClose: () => void;
  type: 'edit' | 'create';
}

function EditTimetable({ onClose, type }: Readonly<IEditTimetable>) {
  const [timeTableName, setTimeTableName] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(SERVICE_SEMESTER_DUMMY.semester);
  const timeTable = useScheduleState(state => state.currentTimetable);

  const { mutate: updateTimetable } = useUpdateTimetable();
  const { mutate: deleteTimetable } = useDeleteTimetable();
  const { mutate: createTimetable } = useCreateTimetable();

  const handleDeleteTimetable = () => {
    if (type === 'edit' && timeTable) {
      deleteTimetable(timeTable.timeTableId);
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (timeTable && type === 'edit') {
      updateTimetable({ timeTableId: timeTable.timeTableId, timeTableName: timeTableName });
      onClose();
      return;
    }
    if (type === 'create') {
      createTimetable({
        timeTableName: timeTableName,
        semester: selectedSemester,
      });
      onClose();
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const handleTimetableSemester = (semester: string) => {
    if (type === 'edit') {
      alert('학기는 수정할 수 없습니다.');
      return;
    }

    setSelectedSemester(semester);
  };

  return (
    <Dialog title={`${type === 'edit' ? '시간표 수정' : '시간표 생성'}`} onClose={onClose} isOpen={true}>
      <form onSubmit={handleSubmit}>
        <Dialog.Content>
          <Label>학기 선택</Label>
          <Grid columns={{ base: 2 }} gap="gap-2">
            {SEMESTERS.map(semester => (
              <Chip
                key={semester}
                label={semester}
                selected={semester === selectedSemester}
                onClick={() => handleTimetableSemester(semester)}
              />
            ))}
          </Grid>

          <TextField
            key="timetableName"
            id="timetableName"
            required={true}
            size="medium"
            placeholder="시간표 이름을 입력해주세요."
            value={timeTableName}
            onChange={e => setTimeTableName(e.target.value)}
          />
        </Dialog.Content>

        <Dialog.Footer>
          <Button type="submit" variant="primary" size="medium">
            저장
          </Button>

          {timeTable && type === 'edit' && (
            <Button
              type="button"
              variant="secondary"
              textColor="secondary"
              size="medium"
              onClick={handleDeleteTimetable}
            >
              삭제
            </Button>
          )}
        </Dialog.Footer>
      </form>
    </Dialog>
  );
}

export default EditTimetable;
