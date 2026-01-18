import { Helmet } from 'react-helmet';
import TimetableComponent from '@/widgets/timetable/TimetableComponent.tsx';
import ContentPanel from '@/features/timetable/ui/ScheduleContentPanel.tsx';
import { TimetableHeaderActions } from '@/widgets/timetable/TimetableHeader';
import { Card, Flex, Heading } from '@allcll/allcll-ui';
import TimetableSemesterTabs from '@/features/timetable/ui/TimetableSemesterTabs.tsx';
import TimetableOverlay from '../../widgets/timetable/TimetableOverlay.tsx';
import { useGetTimetableSchedules, useTimetables } from '@/entities/timetable/api/useTimetableSchedules.ts';
import { useSearchParams } from 'react-router-dom';
import useSemesterTimetableSync from '@/features/timetable/lib/useSemesterTimetableSync.ts';
import TimetableSelect from '@/widgets/timetable/TimetableSelect.tsx';
import { useEffect, useState } from 'react';
import EditTimetable from '@/features/timetable/ui/EditTimetable.tsx';
import useServiceSemester from '@/entities/semester/model/useServiceSemester.ts';
import { SEMESTERS } from '@/entities/semester/api/semester.ts';
import { useScheduleState } from '@/features/timetable/model/useScheduleState.ts';

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

type modalType = 'edit' | 'create' | null;

function TimetableBody({ currentSemester }: { currentSemester: string }) {
  const { data: timetables } = useTimetables(currentSemester);

  const { currentTimetable } = useSemesterTimetableSync(currentSemester, timetables ?? []);
  const pickTimetable = useScheduleState(state => state.pickTimetable);
  const { data: schedules } = useGetTimetableSchedules(currentTimetable?.timeTableId);

  const [isOpenModal, setIsOpenModal] = useState<modalType>(null);

  const handleCreateTimetable = () => {
    setIsOpenModal('create');
  };

  useEffect(() => {
    if (!timetables) return;

    /**
     * 새로 고침 시 동기화 위해
     */
    if (!currentTimetable && timetables.length > 0) {
      pickTimetable(timetables[0]);
    }

    /**
     * Delete된 시간표가 현재 선택된 시간표인 경우 대비
     */
    const isExistTimetable = timetables.find(t => t.timeTableId === currentTimetable?.timeTableId);
    if (!isExistTimetable) {
      pickTimetable(timetables[timetables.length - 1]);
    }
  }, [timetables]);

  return (
    <Card className="px-2 flex flex-col gap-2 relative overflow-hidden">
      <header>
        <Flex align="items-center" justify="justify-between" gap="gap-2">
          <TimetableSelect
            timetables={timetables ?? []}
            currentTimetable={currentTimetable}
            setIsOpenModal={setIsOpenModal}
            openCreateModal={handleCreateTimetable}
          />
          <TimetableHeaderActions setIsOpenModal={setIsOpenModal} />
          {isOpenModal && <EditTimetable type={isOpenModal} onClose={() => setIsOpenModal(null)} />}
        </Flex>
      </header>
      <TimetableComponent schedules={schedules ?? []} />
    </Card>
  );
}

export default Timetable;
