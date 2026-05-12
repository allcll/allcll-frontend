import React, { useEffect, useState } from 'react';
import { useCreateTimetable, useUpdateTimetable } from '@/entities/timetable/api/useTimetableSchedules.ts';
import { useScheduleState } from '@/features/timetable/model/useScheduleState.ts';
import useToastNotification from '@/features/notification/model/useToastNotification.ts';
import { Button, Chip, Dialog, Grid, Label, TextField } from '@allcll/allcll-ui';
import { SEMESTERS } from '@/entities/semester/api/semester.ts';
import useServiceSemester from '@/entities/semester/model/useServiceSemester';
import { showTimetableApiErrorToast } from '../lib/showTimetableApiErrorToast';

interface IEditTimetable {
  onClose: () => void;
  type: 'edit' | 'create';
}

function EditTimetable({ onClose, type }: Readonly<IEditTimetable>) {
  const timeTable = useScheduleState(state => state.currentTimetable);
  const currentSemester = useServiceSemester();

  const [timeTableName, setTimeTableName] = useState(type === 'edit' ? (timeTable?.timeTableName ?? '') : '');

  const [selectedSemester, setSelectedSemester] = useState(
    timeTable?.semesterCode ?? currentSemester.data?.semesterCode ?? '',
  );

  const { mutate: updateTimetable } = useUpdateTimetable();
  const { mutate: createTimetable } = useCreateTimetable();

  const addToast = useToastNotification.getState().addToast;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (timeTable && type === 'edit') {
      updateTimetable(
        { timeTableId: timeTable.timeTableId, timeTableName: timeTableName },
        {
          onError: error =>
            showTimetableApiErrorToast(error, {
              fallbackMessage: '시간표 수정에 실패했습니다. 다시 시도해주세요.',
              tag: 'timetable-update-error',
            }),
        },
      );
      onClose();
      return;
    }
    if (type === 'create') {
      createTimetable(
        { timeTableName: timeTableName, semesterCode: selectedSemester },
        {
          onError: error =>
            showTimetableApiErrorToast(error, {
              fallbackMessage: '시간표 생성에 실패했습니다. 다시 시도해주세요.',
              tag: 'timetable-create-error',
            }),
        },
      );
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

  const handleTimetableSemester = (semesterCode: string) => {
    if (type === 'edit') {
      addToast('학기는 수정할 수 없습니다.', 'semester-edit-warning');
      return;
    }

    setSelectedSemester(semesterCode);
  };

  return (
    <Dialog title={`${type === 'edit' ? '시간표 수정' : '시간표 생성'}`} onClose={onClose} isOpen={true}>
      <form onSubmit={handleSubmit}>
        <Dialog.Content>
          <Label>학기 선택</Label>
          <Grid columns={{ base: 2 }} gap="gap-2">
            {SEMESTERS.map(semester => (
              <Chip
                key={semester.semesterCode}
                label={semester.semesterValue}
                selected={semester.semesterCode === selectedSemester}
                onClick={() => handleTimetableSemester(semester.semesterCode)}
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
        </Dialog.Footer>
      </form>
    </Dialog>
  );
}

export default EditTimetable;
