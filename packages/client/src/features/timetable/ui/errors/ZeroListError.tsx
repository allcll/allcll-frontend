import useScheduleModal from '@/features/timetable/lib/useScheduleModal.ts';
import { ScheduleAdapter } from '@/entities/timetable/model/adapter.ts';
import { Button } from '@allcll/allcll-ui';
import { ZeroContent } from '@/shared/ui/ZeroContent';

function ZeroListError() {
  const { openScheduleModal } = useScheduleModal();
  const initSchedule = new ScheduleAdapter().toUiData();

  return (
    <div className="flex flex-col items-center gap-3 pt-5">
      <ZeroContent
        title="검색 결과가 없습니다."
        description="찾으시는 과목이 없으신가요? 과목을 직접 등록해주세요."
      />

      <Button variant="primary" size="medium" onClick={() => openScheduleModal(initSchedule)}>
        등록하기
      </Button>
    </div>
  );
}

export default ZeroListError;
