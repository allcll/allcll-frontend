import TextField from '../common/TextField';
import { Day } from '@/utils/types';
import Chip from '../common/Chip';
import SelectTime from './SelectTime';
import { useState } from 'react';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { Schedule } from '@/hooks/server/useTimetableData';

interface IEditBottomSheet {
  schedule?: Schedule;
  formType: 'add' | 'edit';
}

interface TimeRange {
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

const DAYS: Day[] = ['월', '화', '수', '목', '금', '토', '일'];

function ScheduleFormContent({ schedule, formType }: IEditBottomSheet) {
  const isEdit = formType === 'edit';
  const { closeBottomSheet } = useBottomSheetStore();

  const [scheduleForm, setScheduleForm] = useState<Schedule>({
    subjectName: schedule?.subjectName ?? '',
    professorName: schedule?.professorName ?? '',
    scheduleType: schedule?.scheduleType ?? 'official',
    subjectId: schedule?.scheduleId ?? null,
    scheduleId: schedule?.scheduleId ?? -1,
    location: schedule?.location ?? '',
    timeslots: [],
  });

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
    e.preventDefault();

    scheduleForm.timeslots.forEach(slot => {
      if (slot.startTime > slot.endTime) {
        alert('시작 시간이 종료 시간 보다 늦지 않아야 합니다.');
        return;
      }
    });

    if (isEdit) {
      // 기존 과목 수정 API 요청
    } else {
      // 새 과목 추가 API 요청
    }

    closeBottomSheet('edit');
  };

  return (
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
        <button type="submit" className="text-red-500 text-xs w-15 rounded px-3 py-2 cursor-pointer ">
          삭제
        </button>
      </div>
    </form>
  );
}

export default ScheduleFormContent;
