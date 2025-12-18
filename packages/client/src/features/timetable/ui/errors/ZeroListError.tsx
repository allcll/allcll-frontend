import SearchSvg from '@/assets/search.svg?react';
import useScheduleModal from '@/features/timetable/lib/useScheduleModal.ts';
import { ScheduleAdapter } from '@/utils/timetable/adapter.ts';
import { Button } from '../../../../../../allcll-ui';

function ZeroListError() {
  const { openScheduleModal } = useScheduleModal();
  const initSchedule = new ScheduleAdapter().toUiData();

  return (
    <div className="flex flex-col gap-2 pt-5 w-full items-center justify-center">
      <SearchSvg className="w-7 h-7" />
      <p className="text-md text-gray-500">검색 결과가 없습니다.</p>
      <span className="text-xs text-gray-400">찾으시는 과목이 없으신가요? 과목을 직접 등록해주세요.</span>

      <Button variant="primary" size="medium" onClick={() => openScheduleModal(initSchedule)}>
        등록하기
      </Button>
    </div>
  );
}

export default ZeroListError;
