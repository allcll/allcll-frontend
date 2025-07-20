import TextField from '../common/TextField';
import { Day } from '@/utils/types';
import Chip from '../common/Chip';

interface ScheduleInfo {
  subjectName: string;
  professorName: string;
  location: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface IEditBottomSheet {
  scheduleForm?: ScheduleInfo;
  onChange: (key: string, value: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const DAYS: Day[] = ['월', '화', '수', '목', '금'];

function ScheduleFormContent({ scheduleForm, onChange, handleSubmit }: IEditBottomSheet) {
  const textFields = [
    {
      id: 'subject',
      placeholder: '과목명',
      value: scheduleForm?.subjectName ?? '',
    },
    {
      id: 'professor',
      placeholder: '교수명',
      value: scheduleForm?.professorName ?? '',
    },
    {
      id: 'location',
      placeholder: '장소',
      value: scheduleForm?.location ?? '',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-5">
      {textFields.map(({ id, placeholder, value }) => (
        <TextField
          key={id}
          id={id}
          required
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(id, e.target.value)}
          onDelete={() => {}}
        />
      ))}

      <div className="flex gap-2 items-center">
        <span className="text-gray-400 text-sm">요일</span>
        {DAYS.map(day => (
          <Chip
            key={day}
            label={day}
            selected={scheduleForm?.dayOfWeek === day}
            onClick={() => onChange('dayOfWeek', day)}
          />
        ))}
      </div>
    </form>
  );
}

export default ScheduleFormContent;
