import { Flex } from '@allcll/allcll-ui';
import { Link, Navigate, useSearchParams } from 'react-router-dom';

import { SEMESTERS, SERVICE_SEMESTER_DUMMY } from '@/entities/semester/api/semester.ts';

function TimetableSemesterTabs() {
  const [searchParams] = useSearchParams();
  const currentSemester = searchParams.get('semester');

  // Todo: 훅으로 분리
  if (!currentSemester) {
    return <Navigate to={`/timetable?semester=${SERVICE_SEMESTER_DUMMY.semester}`} replace />;
  }

  const activeClassName = 'border-b-2 border-primary text-primary pb-2';

  return (
    <Flex gap="gap-4" className="border-b text-sm md:text-base border-gray-200">
      {SEMESTERS.map(semester => {
        const isActive = currentSemester === semester;

        return (
          <Link
            key={semester}
            to={`/timetable?semester=${semester}`}
            className={isActive ? activeClassName : 'text-gray-500 pb-2'}
          >
            {semester}학기
          </Link>
        );
      })}
    </Flex>
  );
}

export default TimetableSemesterTabs;
