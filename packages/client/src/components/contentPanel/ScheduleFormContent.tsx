import Chip from '../common/Chip';
import TextField from '../common/TextField';
import SelectTime from './SelectTime';
import { Day, DAYS } from '@/utils/types';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import useScheduleModal from '@/hooks/useScheduleModal.ts';
import React from 'react';

interface TimeRange {
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

function ScheduleFormContent() {
  const { closeBottomSheet } = useBottomSheetStore();

  const { schedule: scheduleForm, editSchedule: setScheduleForm, saveSchedule, deleteSchedule } = useScheduleModal();
  const { type } = useBottomSheetStore();
  const textFields = [
    {
      id: 'subjectName',
      placeholder: '과목명',
      value: scheduleForm?.subjectName ?? '',
    },
    {
      id: 'professorName',
      placeholder: '교수명',
      value: scheduleForm?.professorName ?? '',
    },
    {
      id: 'location',
      placeholder: '장소',
      value: scheduleForm?.location ?? '',
    },
  ];

  const extractTimeParts = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':');
    const [endHour, endMinute] = endTime.split(':');

    return { startHour, startMinute, endHour, endMinute };
  };

  const toggleDay = (day: Day) => {
    const exists = scheduleForm.timeslots.find(slot => slot.dayOfWeek === day);

    if (exists) {
      setScheduleForm(prev => ({
        ...prev,
        timeslots: prev.timeslots.filter(slot => slot.dayOfWeek !== day),
      }));
    } else {
      setScheduleForm(prev => ({
        ...prev,
        timeslots: [
          ...prev.timeslots,
          {
            dayOfWeek: day,
            startTime: '',
            endTime: '',
          },
        ],
      }));
    }
  };

  const onScheduleFormChange = (key: keyof TimeRange, value: string, targetDay?: Day) => {
    setScheduleForm(prev => {
      const updated = prev.timeslots.map(slot => {
        if (slot.dayOfWeek !== targetDay) return slot;

        const [startHour, startMinute] = slot.startTime.split(':');
        const [endHour, endMinute] = slot.endTime.split(':');

        let newStartTime = slot.startTime;
        let newEndTime = slot.endTime;

        if (key === 'startHour') newStartTime = `${value}:${startMinute}`;
        if (key === 'startMinute') newStartTime = `${startHour}:${value}`;
        if (key === 'endHour') newEndTime = `${value}:${endMinute}`;
        if (key === 'endMinute') newEndTime = `${endHour}:${value}`;

        return {
          ...slot,
          startTime: newStartTime,
          endTime: newEndTime,
        };
      });

      return { ...prev, timeslots: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    // create / edit schedule 동시에 처리
    saveSchedule(e);
    closeBottomSheet('edit');
  };

  const handleDeleteSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    deleteSchedule(e);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {textFields.map(({ id, placeholder, value }) => (
          <TextField
            key={id}
            id={id}
            required
            placeholder={placeholder}
            value={value}
            onChange={e => setScheduleForm(prev => ({ ...prev, [id]: e.target.value }))}
          />
        ))}

        <div className="flex gap-2 flex-col">
          <p className="text-gray-400 text-xs">요일</p>
          <div className="flex gap-2 items-center">
            {DAYS.map(day => (
              <Chip
                key={day}
                label={day}
                selected={scheduleForm.timeslots.some(slot => slot.dayOfWeek === day)}
                onClick={() => toggleDay(day)}
              />
            ))}
          </div>
        </div>

        {scheduleForm.timeslots.map(slot => {
          return (
            <>
              <p className="text-blue-500 text-xs">{slot.dayOfWeek}</p>
              <SelectTime
                key={slot.dayOfWeek}
                day={slot.dayOfWeek}
                timeRange={extractTimeParts(slot.startTime, slot.endTime)}
                onChange={onScheduleFormChange}
              />
            </>
          );
        })}

        <div className="flex  justify-end gap-3">
          <button type="submit" className="text-blue-500 text-xs w-15 rounded px-4 py-2 cursor-pointer ">
            저장
          </button>
          {type === 'edit' && (
            <button
              type="button"
              onClick={handleDeleteSchedule}
              className="text-red-500 text-xs w-15 rounded px-3 py-2 cursor-pointer "
            >
              삭제
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default ScheduleFormContent;
