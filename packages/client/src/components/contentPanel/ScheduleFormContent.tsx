import React from 'react';
import TextField from '../common/TextField';
import SelectTime from './SelectTime';
import { Day, DAYS } from '@/utils/types';
import Chip from '@common/components/chip/Chip';
import useScheduleModal, { useScheduleModalData } from '@/hooks/useScheduleModal.ts';
import { ScheduleMutateType, useScheduleState } from '@/store/useScheduleState';
import { useBottomSheetStore } from '@/store/useBottomSheetStore.ts';

interface TimeRange {
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

function ScheduleFormContent() {
  const { schedule: scheduleForm, modalActionType } = useScheduleModalData();
  const { editSchedule: setScheduleForm, saveSchedule, deleteSchedule, cancelSchedule } = useScheduleModal();

  const openBottomSheet = useBottomSheetStore(state => state.openBottomSheet);

  const isMobile = useScheduleState(state => state.options.isMobile);

  const textFields = [
    {
      id: 'subjectName',
      name: '과목명',
      value: scheduleForm?.subjectName ?? '',
    },
    {
      id: 'professorName',
      name: '교수명',
      value: scheduleForm?.professorName ?? '',
    },
    {
      id: 'location',
      name: '장소',
      value: scheduleForm?.location ?? '',
    },
  ];

  const extractTimeParts = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':');
    const [endHour, endMinute] = endTime.split(':');

    return { startHour, startMinute, endHour, endMinute };
  };

  const toggleDay = (day: Day) => {
    const exists = scheduleForm.timeSlots.find(slot => slot.dayOfWeeks === day);

    if (exists) {
      setScheduleForm(prev => ({
        ...prev,
        timeSlots: prev.timeSlots.filter(slot => slot.dayOfWeeks !== day),
      }));
    } else {
      setScheduleForm(prev => ({
        ...prev,
        timeSlots: [
          ...prev.timeSlots,
          {
            dayOfWeeks: day,
            startTime: '',
            endTime: '',
          },
        ],
      }));
    }
  };

  const onScheduleFormChange = (key: keyof TimeRange, value: string, targetDay?: Day) => {
    const parseValue = (timeSlot: string) => {
      let [hour, minute] = timeSlot.split(':').map(Number);

      if (isNaN(hour)) hour = 9;
      if (isNaN(minute)) minute = 0;

      return [hour.toString(), minute.toString().padStart(2, '0')];
    };

    const reconcileTimeString = (timeString: string) => {
      const [hour, minute] = parseValue(timeString);
      return `${hour}:${minute}`;
    };

    setScheduleForm(prev => {
      const updated = prev.timeSlots.map(slot => {
        console.log(slot);

        if (slot.dayOfWeeks !== targetDay) return slot;

        const [startHour, startMinute] = parseValue(slot.startTime);
        const [endHour, endMinute] = parseValue(slot.endTime);

        let newStartTime = slot.startTime;
        let newEndTime = slot.endTime;

        if (key === 'startHour') newStartTime = `${value}:${startMinute}`;
        if (key === 'startMinute') newStartTime = `${startHour}:${value}`;
        if (key === 'endHour') newEndTime = `${value}:${endMinute}`;
        if (key === 'endMinute') newEndTime = `${endHour}:${value}`;

        return {
          ...slot,
          startTime: reconcileTimeString(newStartTime),
          endTime: reconcileTimeString(newEndTime),
        };
      });

      return { ...prev, timeSlots: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    saveSchedule(e);
  };

  const handleDeleteSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    deleteSchedule(e);
  };

  const gotoSearchContents = () => {
    cancelSchedule();
    openBottomSheet('search');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {textFields.map(({ id, name, value }) => (
        <div key={'text-field' + id} className="flex gap-6">
          <TextField
            id={id}
            placeholder={`${name}을 입력해주세요`}
            value={value}
            label={name}
            onChange={e => setScheduleForm(prev => ({ ...prev, [id]: e.target.value }))}
            required
          />
        </div>
      ))}

      <div className="flex gap-2 flex-row">
        <div className="flex gap-2 items-center">
          <p className="text-gray-400 text-xs">요일</p>
          {DAYS.map(day => (
            <Chip
              key={day}
              label={day}
              selected={scheduleForm.timeSlots.some(slot => slot.dayOfWeeks === day)}
              onClick={() => toggleDay(day)}
            />
          ))}
        </div>
      </div>

      {scheduleForm.timeSlots.map(slot => {
        return (
          <div key={slot.dayOfWeeks} className="flex gap-2 ">
            <p className="text-xs text-gray-400">{slot.dayOfWeeks}</p>
            <SelectTime
              day={slot.dayOfWeeks}
              timeRange={extractTimeParts(slot.startTime, slot.endTime)}
              onChange={onScheduleFormChange}
            />
          </div>
        );
      })}

      <div className="flex justify-between items-center">
        <div>
          {isMobile && (
            <button
              type="button"
              className="text-xs text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
              onClick={gotoSearchContents}
            >
              + 과목 일정 추가
            </button>
          )}
        </div>
        <div className="flex justify-end gap-3">
          {(modalActionType === ScheduleMutateType.EDIT || modalActionType === ScheduleMutateType.VIEW) && (
            <button
              type="button"
              onClick={handleDeleteSchedule}
              className="text-xs text-white bg-red-500 hover:bg-red-600 w-15 rounded-lg px-4 py-2 cursor-pointer "
            >
              삭제
            </button>
          )}

          <button
            type="submit"
            className="text-xs text-white bg-blue-500 hover:bg-blue-600 w-15 rounded-lg px-4 py-2 cursor-pointer "
          >
            저장
          </button>
        </div>
      </div>
    </form>
  );
}

export default ScheduleFormContent;
