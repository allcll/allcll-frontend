import { Helmet } from 'react-helmet';
import ContentPanel from '@/features/timetable/ui/ScheduleContentPanel.tsx';
import {  Flex, Heading } from '@allcll/allcll-ui';
import TimetableSemesterTabs from '@/features/timetable/ui/TimetableSemesterTabs.tsx';
import { useSearchParams } from 'react-router-dom';
import useServiceSemester from '@/entities/semester/model/useServiceSemester.ts';
import { SEMESTERS } from '@/entities/semester/api/semester.ts';
import TimetableBody from '@/features/timetable/ui/TimetableBody.tsx';
import TimetableOverlay from '@/widgets/timetable/TimetableOverlay';

function Timetable() {
  const { data } = useServiceSemester('timetable');

  const [searchParams] = useSearchParams();
  const currentSemester = searchParams.get('semester') ?? data?.semester ?? SEMESTERS[0];

  return (
    <div className="px-4 py-2">
      <Helmet>
        <title>ALLCLL | 시간표</title>
      </Helmet>

      <div className="grid md:grid-cols-5 gap-4 mb-4">
        <div className="md:col-span-3 w-full">
          <Flex direction="flex-col" gap="gap-2">
            <Heading level={1}>올클시간표</Heading>
            <TimetableSemesterTabs currentSemester={currentSemester} />
            <TimetableBody currentSemester={currentSemester} />
          </Flex>
        </div>

        <div className="w-full md:col-span-2 hidden md:block">
          <ContentPanel />
        </div>
      </div>

      <TimetableOverlay />
    </div>
  );
}

export default Timetable;
