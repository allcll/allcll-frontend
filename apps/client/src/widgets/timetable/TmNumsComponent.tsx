import { GeneralSchedule } from '@/entities/timetable/api/useTimetableSchedules';

interface ITmNumsComponentProps {
  schedules: GeneralSchedule[];
}

function TmNumsComponent({ schedules }: ITmNumsComponentProps) {
  const tmNums = schedules?.reduce<number[]>(
    (acc, cur) => {
      if (cur.scheduleType !== 'official' || !cur.tmNum) return acc;

      const tms = cur.tmNum.split('/').map(tm => {
        const num = Number(tm);
        return Number.isNaN(num) ? 0 : num;
      });

      return acc.map((num, index) => num + (tms[index] ?? 0));
    },
    [0, 0, 0],
  ) ?? [0, 0, 0];

  return (
    <div className="flex items-center gap-4 text-xs text-gray-500 bg-blue-50 rounded-md p-2 mt-3">
      <span>총 학점: {tmNums[0] ?? 0}</span>
      <span>이론: {tmNums[1] ?? 0}</span>
      <span>실습: {tmNums[2] ?? 0}</span>
    </div>
  );
}

export default TmNumsComponent;
