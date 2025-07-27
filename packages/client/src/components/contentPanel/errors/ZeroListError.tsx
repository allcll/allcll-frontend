import SearchSvg from '@/assets/search.svg?react';
import useScheduleModal from '@/hooks/useScheduleModal';
import { ScheduleAdapter } from '@/utils/timetable/adapter';

function ZeroListError() {
  const { openScheduleModal } = useScheduleModal();
  const initSchedule = new ScheduleAdapter().toUiData();

  return (
    <div className="flex flex-col h-full gap-2 pt-5 w-full items-center justify-center">
      <SearchSvg className="w-7 h-7" />
      <p className="text-md text-gray-500">검색 결과가 없습니다.</p>
      <span className="text-xs text-gray-400">찾으시는 과목이 없으신가요? 과목을 직접 등록해주세요.</span>

      <button
        className="bg-blue-500 text-white text-sm px-4 py-1 rounded-lg  hover:bg-blue-500 cursor-pointer justify-center items-center"
        onClick={() => openScheduleModal(initSchedule)}
      >
        등록하기
      </button>
    </div>
  );
}

export default ZeroListError;
