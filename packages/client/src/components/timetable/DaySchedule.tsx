import Schedule from '@/components/timetable/Schedule.tsx';
import WireSchedule from '@/components/timetable/WireSchedule.tsx';

const TimeslotDummies = [
  {
    title: '알고리즘',
    professor: '이교수',
    location: '센B206',
    color: 'blue',
    width: 'calc(100% - 4px)',
    height: '120px',
    top: '0px',
  },
  {
    title: '자료구조',
    professor: '김교수',
    location: '센B207',
    color: 'emerald',
    width: 'calc(100% - 4px)',
    height: '80px',
    top: '150px',
  },
  {
    title: '운영체제',
    professor: '박교수',
    location: '센B208',
    color: 'green',
    width: 'calc(100% - 4px)',
    height: '60px',
    top: '240px',
  },
  {
    title: '컴퓨터네트워크',
    professor: '최교수',
    location: '센B209',
    color: 'amber',
    width: 'calc(100% - 4px)',
    height: '20px',
    top: '340px',
  },
  {
    title: '소프트웨어공학',
    professor: '정교수',
    location: '센B210',
    color: 'rose',
    width: 'calc(100% - 4px)',
    height: '10px',
    top: '400px',
  },
];

function DaySchedule() {
  const Timeslots = TimeslotDummies;

  return (
    <div className="relative flex-auto px-[2px]">
      <WireSchedule title="알고" professor="ㄴㄴ" location="ㄴ" color="violet" />
      {Timeslots.map(({ title, professor, location, color, width, height, top }, index) => (
        <Schedule
          key={'schedule-' + index}
          title={title}
          professor={professor}
          location={location}
          color={color as 'rose' | 'amber' | 'green' | 'emerald' | 'blue' | 'violet'}
          style={{ height, top, width }}
        />
      ))}
    </div>
  );
}

export default DaySchedule;
