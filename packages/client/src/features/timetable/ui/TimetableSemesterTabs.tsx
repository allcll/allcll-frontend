import { Flex } from '@allcll/allcll-ui';
import { Link } from 'react-router-dom';

import { SEMESTERS } from '@/entities/semester/api/semester.ts';

function TimetableSemesterTabs({ currentSemester }: { currentSemester?: string }) {
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
