import { Flex } from '@allcll/allcll-ui';
import { Link } from 'react-router-dom';
import { SEMESTERS } from '@/entities/semester/api/semester.ts';

// FALL_25 ~ 최신학기
const START_SEMESTER_CODE = 'FALL_25';

const startIdx = SEMESTERS.findIndex(s => s.semesterCode === START_SEMESTER_CODE);
const TIMETABLE_SEMESTERS = startIdx !== -1 ? SEMESTERS.slice(0, startIdx + 1) : [];

function TimetableSemesterTabs({ currentSemester }: { currentSemester?: string }) {
  const activeClassName = 'border-b-2 border-primary text-primary pb-2';

  return (
    <Flex gap="gap-4" className="border-b text-sm border-gray-200">
      {TIMETABLE_SEMESTERS.map(semester => {
        const isActive = currentSemester === semester.semesterCode;

        return (
          <Link
            key={semester.semesterCode}
            to={`/timetable?semester=${semester.semesterCode}`}
            className={isActive ? activeClassName : 'text-gray-500 pb-2'}
          >
            {semester.semesterValue}학기
          </Link>
        );
      })}
    </Flex>
  );
}

export default TimetableSemesterTabs;
