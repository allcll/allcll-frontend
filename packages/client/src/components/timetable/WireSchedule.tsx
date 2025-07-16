import { IScheduleProps } from '@/components/timetable/Schedule.tsx';

function WireSchedule({ title, professor, location, ...attrs }: IScheduleProps) {
  return (
    <div
      className={`flex absolute rounded-md border-4 border-violet-500 z-20 ` + attrs.className}
      style={{ width: 'calc(100% - 4px)' }}
      {...attrs}
    >
      <div className={`flex-auto p-2 bg-violet-50 rounded-md animate-pulse`}>
        <h3 className={`text-violet-500 font-semibold text-sm`}>{title}</h3>
        <p className="text-xs text-gray-500">
          {professor} {location}
        </p>
      </div>
    </div>
  );
}

export default WireSchedule;
