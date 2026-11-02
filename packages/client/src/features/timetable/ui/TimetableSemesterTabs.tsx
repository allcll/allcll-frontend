import { TabNav } from '@allcll/allcll-ui';
import { Link } from 'react-router-dom';
import { SEMESTERS } from '@/entities/semester/api/semester.ts';

// FALL_25 ~ 최신학기
const START_SEMESTER_CODE = 'FALL_25';

const startIdx = SEMESTERS.findIndex(s => s.semesterCode === START_SEMESTER_CODE);
const TIMETABLE_SEMESTERS = startIdx !== -1 ? SEMESTERS.slice(0, startIdx + 1) : [];

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
