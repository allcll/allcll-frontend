import { useTimetableSchedules } from '@/hooks/server/useTimetableSchedules.ts';

function TmNumsComponent() {
  const { data: schedules } = useTimetableSchedules();

  const tmNums = schedules?.reduce(
    (acc, cur) => {
      if (cur.scheduleType === 'official') return acc;
      // Todo: Schedule type 업데이트 후 만들기

      return acc;
    },
    [0, 0, 0],
  );

  return (
    <div className="flex items-center gap-4 text-xs text-gray-500 bg-blue-50 p-2 rounded-md">
      <span>총 학점: {tmNums?.[0] ?? 0}</span>
      <span>이론: {tmNums?.[1] ?? 0}</span>
      <span>실습: {tmNums?.[2] ?? 0}</span>
    </div>
  );
}

export default TmNumsComponent;
