import { IScheduleProps } from '@/components/timetable/Schedule.tsx';

function WireSchedule({ title, professor, location, ...attrs }: IScheduleProps) {
  return (
    <div className={`flex absolute rounded-xs border-2 border-violet-500 z-20 ` + attrs.className} {...attrs}>
      <div className={`flex-auto p-2 bg-violet-50 animate-pulse`}>
        <h3 className={`text-violet-500 font-semibold text-sm`}>{title}</h3>
        <p className="text-xs text-gray-500">
          {professor} {location}
        </p>
      </div>
    </div>
  );
}

export default WireSchedule;
