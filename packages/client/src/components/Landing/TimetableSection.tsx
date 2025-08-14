import Section from '@/components/Landing/Section.tsx';
import SectionHeader from '@/components/Landing/SectionHeader.tsx';
import Card from '@common/components/Card';
import TimetableGridComponent from '@/components/timetable/TimetableGridComponent.tsx';
import { GeneralSchedule, getScheduleSlots, ScheduleSlot } from '@/hooks/server/useTimetableSchedules.ts';
import Schedule from '@/components/timetable/Schedule.tsx';

const colNames = ['월', '화', '수', '목', '금'];
const rowNames = Array.from({ length: 5 }, (_, i) => `${i + 9}`);

const ScheduleData = [
  {
    scheduleId: '1',
    scheduleType: 'custom',
    subjectId: null,
    subjectName: '컴퓨터공학개론',
    professorName: '김교수',
    location: '센B209',
    tmNum: '3/1/0',
    isDeleted: false,
    timeSlots: [
      { dayOfWeeks: '월', startTime: '09:00', endTime: '10:30' },
      { dayOfWeeks: '수', startTime: '09:00', endTime: '10:30' },
    ],
  },
  {
    scheduleId: '2',
    scheduleType: 'custom',
    subjectId: null,
    subjectName: '자료구조',
    professorName: '김교수',
    location: '센B209',
    tmNum: '3/1/0',
    isDeleted: false,
    timeSlots: [
      { dayOfWeeks: '화', startTime: '11:00', endTime: '12:30' },
      { dayOfWeeks: '목', startTime: '11:00', endTime: '12:30' },
    ],
  },
  {
    scheduleId: 3,
    scheduleType: 'custom',
    subjectId: null,
    subjectName: '운영체제',
    professorName: '김교수',
    location: '센B209',
    tmNum: '3/1/0',
    isDeleted: false,
    timeSlots: [
      { dayOfWeeks: '수', startTime: '12:00', endTime: '13:30' },
      { dayOfWeeks: '금', startTime: '12:00', endTime: '13:30' },
    ],
  },
] as GeneralSchedule[];

function TimetableSection() {
  const data = getScheduleSlots(ScheduleData, 9);

  return (
    <Section>
      <SectionHeader title="시간표" subtitle="시간표 부터 전략적 세종대 수강신청 준비" href="/timetable" />

      <Card className="mt-6">
        <TimetableGridComponent colNames={colNames} rowNames={rowNames}>
          {colNames.map(dayName => (
            <DaySchedule key={dayName} data={data ? data[dayName] : []} />
          ))}
        </TimetableGridComponent>
      </Card>
    </Section>
  );
}

function DaySchedule({ data }: Readonly<{ data?: ScheduleSlot[] }>) {
  if (!data) return <div className="relative flex-auto px-[2px]"></div>;

  return (
    <div className="relative flex-auto px-[2px]">
      {data.map(({ title, professor, location, color, height, top, left, right, schedule }, index) => (
        <Schedule
          key={'schedule-' + index}
          timeslotIndex={index}
          title={title}
          professor={professor ?? ''}
          location={location ?? ''}
          schedule={schedule}
          color={color}
          style={{ height, top, left, right }}
          selected={false}
          fixed
        />
      ))}
    </div>
  );
}

export default TimetableSection;
