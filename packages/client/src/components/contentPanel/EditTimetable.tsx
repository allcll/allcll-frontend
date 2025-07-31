import XDarkGraySvg from '@/assets/x-darkgray.svg?react';
import TextField from '../common/TextField';
import React, { useEffect, useState } from 'react';
import Chip from '../common/Chip';
import { useCreateTimetable, useDeleteTimetable, useUpdateTimetable } from '@/hooks/server/useTimetableSchedules.ts';
import { useScheduleState } from '@/store/useScheduleState.ts';

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
    // const result = confirm('시간표를 삭제하시겠습니까?');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10" onClick={onClose}>
      <div
        className="bg-white flex border border-gray-200 rounded-xl flex-col gap-2 w-[90%] max-w-md p-8 shadow-xl relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex w-full justify-between">
          <h3 className="font-semibold">시간표 {type === 'create' ? '생성' : '수정'}</h3>
          <button
            className="w-6 h-6 cursor-pointer flex items-center justify-center bg-gray-100 rounded-full"
            onClick={onClose}
          >
            <XDarkGraySvg />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Chip label="2025학년-2학기" selected={false} />
          <TextField
            key="timetableName"
            id="timetableName"
            required
            placeholder="시간표 이름을 입력해주세요."
            value={timeTableName}
            onChange={e => setTimeTableName(e.target.value)}
          />

          <div className="flex  justify-end gap-3">
            <button type="submit" className="text-blue-500 text-sm w-15 rounded px-4 py-2 cursor-pointer">
              저장
            </button>
            {timeTable && type === 'edit' && (
              <button
                type="button"
                onClick={handleDeleteTimetable}
                className="text-red-500 text-sm w-15 rounded px-3 py-2 cursor-pointer"
              >
                삭제
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTimetable;
