import { Flex } from '@allcll/allcll-ui';
import { Link, useSearchParams } from 'react-router-dom';

const SEMESTERS = ['2025-2', '2025-WINTER'];

function TimetableTabs() {
  const [searchParams] = useSearchParams();
  const currentSemester = searchParams.get('semester');

  const activeClassName = 'border-b-2 border-primary text-primary pb-2';

  return (
    <Flex gap="gap-4" className="border-b px-4 border-gray-200 mb-4">
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

export default TimetableTabs;
