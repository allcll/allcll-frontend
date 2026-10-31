import useScheduleModal from '@/features/timetable/lib/useScheduleModal.ts';
import { ScheduleAdapter } from '@/entities/timetable/model/adapter.ts';
import { Button, EmptyState, SearchIcon } from '@allcll/allcll-ui';

function ZeroListError() {
  const { openScheduleModal } = useScheduleModal();
  const initSchedule = new ScheduleAdapter().toUiData();

  return (
    <EmptyState
      icon={SearchIcon}
      title="검색 결과가 없습니다."
      description="찾는 과목이 없나요? 커스텀 일정을 직접 등록해주세요."
      className="pt-5"
    >
      <Button variant="solid" size="medium" onClick={() => openScheduleModal(initSchedule)}>
        등록하기
      </Button>
    </EmptyState>
  );
}

export default ZeroListError;
