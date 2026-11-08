import { TabNav } from '@allcll/allcll-ui';
import { Link } from 'react-router-dom';
import { TIMETABLE_SEMESTERS } from '@/features/timetable/lib/useTimetableSemester.ts';

function TimetableSemesterTabs({ currentSemester }: { currentSemester?: string }) {
  return (
    <TabNav aria-label="학기 선택">
      {TIMETABLE_SEMESTERS.map(semester => (
        <TabNav.Item key={semester.semesterCode} asChild selected={currentSemester === semester.semesterCode}>
          <Link to={`/timetable?semester=${semester.semesterCode}`}>{semester.semesterValue}학기</Link>
        </TabNav.Item>
      ))}
    </TabNav>
  );
}

export default TimetableSemesterTabs;
