import { Helmet } from 'react-helmet';
import ContentPanel from '@/features/timetable/ui/ScheduleContentPanel.tsx';
import { Flex } from '@allcll/allcll-ui';
import TimetableSemesterTabs from '@/features/timetable/ui/TimetableSemesterTabs.tsx';
import TimetableBody from '@/features/timetable/ui/TimetableBody.tsx';
import TimetableOverlay from '@/widgets/timetable/TimetableOverlay';
import { useTimetableSemester } from '@/features/timetable/lib/useTimetableSemester';
import PageContainer from '@/shared/ui/PageContainer';
import PageHeader from '@/shared/ui/PageHeader';

function Timetable() {
  const { currentSemester } = useTimetableSemester();

  return (
    <PageContainer>
      <Helmet>
        <title>ALLCLL | 시간표</title>
        <meta name="description" content="나만의 시간표를 만들고, 관리해보세요!" />
      </Helmet>

      <div className="grid md:grid-cols-5 gap-4">
        <div className="md:col-span-3 w-full">
          <PageHeader title="시간표" description="학기별로 나만의 시간표를 만들고, 과목을 검색해 추가해보세요." />
          <Flex direction="flex-col" gap="gap-2">
            <TimetableSemesterTabs currentSemester={currentSemester} />
            <TimetableBody currentSemester={currentSemester} />
          </Flex>
        </div>

        <div className="w-full md:col-span-2 hidden md:block">
          <ContentPanel />
        </div>
      </div>

      <TimetableOverlay />
    </PageContainer>
  );
}

export default Timetable;
