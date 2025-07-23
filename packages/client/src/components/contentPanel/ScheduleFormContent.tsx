import TextField from '../common/TextField';
import { Day } from '@/utils/types';
import Chip from '../common/Chip';
import SelectTime from './SelectTime';
import { useState } from 'react';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';

interface ScheduleInfo {
  subjectName: string;
  professorName: string;
  location: string;
  dayOfWeek: Day[];
  startTime: string;
  endTime: string;
}

interface IEditBottomSheet {
  schedule?: ScheduleInfo;
  formType: 'add' | 'edit';
}

const DAYS: Day[] = ['월', '화', '수', '목', '금'];

function ScheduleFormContent({ schedule, formType }: IEditBottomSheet) {
  const isEdit = formType === 'edit';
  const { closeBottomSheet } = useBottomSheetStore();

  const [scheduleForm, setScheduleForm] = useState<ScheduleInfo>({
    subjectName: schedule?.subjectName ?? '',
    professorName: schedule?.professorName ?? '',
    location: schedule?.location ?? '',
    dayOfWeek: schedule?.dayOfWeek ?? [],
    startTime: schedule?.startTime ?? '',
    endTime: schedule?.endTime ?? '',
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
    const current = scheduleForm?.dayOfWeek ?? [];
    const isSelected = current.includes(day);

    const days = isSelected ? current.filter(d => d !== day) : [...current, day];
    onScheduleFormChange('dayOfWeek', days);
  };

  const onScheduleFormChange = (key: string, value: string | Day[]) => {
    console.log('onScheduleFormChange', key, value);
    if (key === 'startHour') {
      const [, minute] = scheduleForm.startTime.split(':');
      value = `${value}:${minute}`;
      key = 'startTime';
      setScheduleForm(prev => ({ ...prev, [key]: value }));
      return;
    }

    if (key === 'endHour') {
      const [, minute] = scheduleForm.startTime.split(':');
      value = `${value}:${minute}`;
      key = 'endTime';
      setScheduleForm(prev => ({ ...prev, [key]: value }));
      return;
    }

    if (key === 'startMinute') {
      const [hour] = scheduleForm.startTime.split(':');
      value = `${hour}:${value}`;
      key = 'startTime';
      setScheduleForm(prev => ({ ...prev, [key]: value }));
      return;
    }

    if (key === 'endMinute') {
      const [hour] = scheduleForm.endTime.split(':');
      value = `${hour}:${value}`;
      key = 'endTime';
      setScheduleForm(prev => ({ ...prev, [key]: value }));
      return;
    }

    setScheduleForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (scheduleForm.startTime > scheduleForm.endTime) {
      alert('시작 시간이 종료 시간 보다 늦지 않아야 합니다.');
      return;
    }

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
          onChange={e => onScheduleFormChange(id, e.target.value)}
          onDelete={() => {}}
        />
      ))}

      <div className="flex gap-2  flex-col ">
        <p className="text-gray-400 text-xs">요일</p>
        <div className="flex gap-2  items-center">
          {DAYS.map(day => (
            <Chip
              key={day}
              label={day}
              selected={scheduleForm?.dayOfWeek.includes(day)}
              onClick={() => toggleDay(day)}
            />
          ))}
        </div>
      </div>

      <SelectTime
        timeRange={extractTimeParts(scheduleForm?.startTime ?? '', scheduleForm?.endTime ?? '')}
        onChange={onScheduleFormChange}
      />

      <div className="flex  justify-end gap-3">
        <button type="submit" className="text-blue-500 text-sm w-15 rounded px-4 py-2 cursor-pointer ">
          저장
        </button>
        <button type="submit" className="text-red-500 text-sm w-15 rounded px-3 py-2 cursor-pointer ">
          삭제
        </button>
      </div>
    </form>
  );
}

export default ScheduleFormContent;
