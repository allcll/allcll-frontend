import { TimetableHeaderActions } from '@/widgets/timetable/TimetableHeader';
import TimetableSelect from '@/widgets/timetable/TimetableSelect';
import { Card, Flex } from '@allcll/allcll-ui';
import EditTimetable from './EditTimetable';
import TimetableComponent from '@/widgets/timetable/TimetableComponent';
import { useGetTimetableSchedules, useTimetables } from '@/entities/timetable/api/useTimetableSchedules';
import useSemesterTimetableSync from '../lib/useSemesterTimetableSync';
import { useScheduleState } from '../model/useScheduleState';
import { useEffect, useState } from 'react';

type modalType = 'edit' | 'create' | null;

function TimetableBody({ currentSemester }: { currentSemester: string }) {
  const { data: timetables } = useTimetables(currentSemester);

  const { currentTimetable } = useSemesterTimetableSync(currentSemester, timetables ?? []);
  const pickTimetable = useScheduleState(state => state.pickTimetable);
  const { data: schedules } = useGetTimetableSchedules(currentTimetable?.timeTableId, currentSemester);

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

export default TimetableBody;
