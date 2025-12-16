import { Helmet } from 'react-helmet';
import TimetableComponent from '@/components/timetable/TimetableComponent.tsx';
import ContentPanel from '@/components/contentPanel/ScheduleContentPanel';
import TimetableHeader from '@/components/timetable/TimetableHeader';
import { Card, Flex, Grid, Heading } from '@allcll/allcll-ui';
import TimetableSemesterTabs from '@/components/timetable/TimetableSemesterTabs';
import { SERVICE_SEMESTER_DUMMY } from '@/hooks/server/useServiceSemester';
import { Navigate, useSearchParams } from 'react-router-dom';
import TimetableOverlay from './TimetableOverlay';

function Timetable() {
  const [searchParams] = useSearchParams();
  const semester = searchParams.get('semester');

  if (!semester) {
    return <Navigate to={`/timetable?semester=${SERVICE_SEMESTER_DUMMY.semester}`} replace />;
  }

  return (
    <div className="px-4  py-2">
      <Helmet>
        <title>ALLCLL | 시간표</title>
      </Helmet>
      <div className="grid md:grid-cols-5 gap-4 mb-4">
        <div className="md:col-span-3 w-full">
          <Flex direction="flex-col" gap="gap-2">
            <Heading level={1}>올클시간표</Heading>
            <TimetableSemesterTabs currentSemester={semester} />
            <Card className="px-2 flex flex-col gap-2 relative overflow-hidden">
              <TimetableHeader />
              <TimetableComponent />
            </Card>
          </Flex>
        </div>

        <div className="md:col-span-2 w-full">
          <div className="hidden md:block">
            <ContentPanel />
          </div>
        </div>
      </div>

      <TimetableOverlay />
    </div>
  );
}

export default Timetable;
