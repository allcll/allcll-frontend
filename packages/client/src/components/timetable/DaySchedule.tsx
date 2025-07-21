// import { useState } from 'react';
import Schedule from '@/components/timetable/Schedule.tsx';
import { ScheduleTime } from '@/hooks/server/useTimetableData.ts';

function DaySchedule({ scheduleTimes }: Readonly<{ scheduleTimes: ScheduleTime[] }>) {
  const Timeslots = scheduleTimes;
  const RandomNumber = Math.floor(Math.random() * 1000);
  // const [newSchedule, setNewSchedule] = useState(null);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // Handle click event, e.g., open a modal or navigate to a detailed view
    console.log('DaySchedule clicked');
    console.log(RandomNumber, e.nativeEvent.offsetY);
  };

  return (
    <div
      className="relative flex-auto px-[2px]"
      onClick={onClick}
      // onMouseDown={onMouseDown}
      // onMouseMove={onMouseMove}
      // onMouseUp={onMouseUp}
    >
      {/*<WireSchedule title="알고" professor="ㄴㄴ" location="ㄴ" color="violet" />*/}
      {Timeslots.map(({ title, professor, location, color, width, height, top }, index) => (
        <Schedule
          key={'schedule-' + index}
          title={title}
          professor={professor ?? ''}
          location={location ?? ''}
          color={color}
          style={{ height, top, width }}
        />
      ))}
    </div>
  );
}

export default DaySchedule;
