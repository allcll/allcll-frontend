import React, { useEffect, useState } from 'react';
import Chip from '@common/components/chip/Chip';
import { useCreateTimetable, useDeleteTimetable, useUpdateTimetable } from '@/hooks/server/useTimetableSchedules.ts';
import { useScheduleState } from '@/store/useScheduleState.ts';
import { Button, Dialog, TextField } from '@allcll/allcll-ui';

interface IEditTimetable {
  onClose: () => void;
  type: 'edit' | 'create';
}

function EditTimetable({ onClose, type }: Readonly<IEditTimetable>) {
  const [timeTableName, setTimeTableName] = useState('');
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
        semester: '2025-2',
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

  return (
    <Dialog title={`${type === 'edit' ? '시간표 수정' : '시간표 생성'}`} onClose={onClose} isOpen={true}>
      <form onSubmit={handleSubmit}>
        <Dialog.Content>
          <Chip label="2025학년-2학기" selected={false} />
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
