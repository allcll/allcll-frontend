import { useDeferredValue, useState } from 'react';
import BottomSheet from '../../../../shared/ui/bottomsheet/BottomSheet.tsx';
import TimetableSubjectCards from '@/features/timetable/ui/subject/TimetableSubjectCards.tsx';
import SearchBox from '@/features/filtering/ui/SearchBox.tsx';
import useScheduleModal from '@/features/timetable/lib/useScheduleModal.ts';
import useFilteringSubjects from '@/features/filtering/lib/useFilteringSubjects.ts';
import { useScheduleSearchStore } from '@/features/filtering/model/useFilterStore.ts';
import { ScheduleAdapter } from '@/entities/timetable/model/adapter.ts';
import { AddIcon, Flex } from '@allcll/allcll-ui';
import FilteringButton from '@/features/filtering/ui/button/FilteringButton.tsx';
import useWishes from '@/entities/wishes/model/useWishes.ts';
import useSearchRank from '@/features/filtering/lib/useSearchRank.ts';
import { useSemesterParam } from '@/entities/semester/model/useSemesterParam.ts';

interface ISearchBottomSheet {
  onCloseSearch: () => void;
  onOpenFiltering: () => void;
}

function ScheduleSearchBottomSheet({ onCloseSearch, onOpenFiltering }: ISearchBottomSheet) {
  const semester = useSemesterParam();

  const { openScheduleModal } = useScheduleModal();

  const { data, isPending } = useWishes(semester);
  const subjects = useSearchRank(data) ?? [];
  const filters = useScheduleSearchStore(state => state.filters);
  const setFilter = useScheduleSearchStore(state => state.setFilter);
  const filteredData = useDeferredValue(useFilteringSubjects(subjects, filters));
  const initSchedule = new ScheduleAdapter().toUiData();
  const { keywords } = filters;

  // 과목을 고르면 시트를 내려 뒤쪽 시간표에서 시간대를 보여줌
  const previewSnapPoint = `${Math.max(window.innerHeight - 400, 240)}px`;
  const [snapPoint, setSnapPoint] = useState<number | string | null>(1);

  return (
    <BottomSheet
      title="과목 검색"
      onClose={onCloseSearch}
      headerLeft={
        <button
          type="button"
          aria-label="커스텀 일정 추가"
          className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full"
          onClick={() => openScheduleModal(initSchedule)}
        >
          <AddIcon className="w-4 h-4 text-gray-600" />
        </button>
      }
      snapPoints={[previewSnapPoint, 1]}
      activeSnapPoint={snapPoint}
      setActiveSnapPoint={setSnapPoint}
    >
      <div className="sticky px-4 top-0 bg-white z-content flex items-center gap-2 py-3">
        <SearchBox
          type="text"
          placeholder="과목명 및 교수명 검색"
          value={keywords}
          onChange={e => setFilter('keywords', e.target.value)}
          onDelete={() => setFilter('keywords', '')}
          className="w-full"
        />

        <FilteringButton handleOpenFilter={onOpenFiltering} />
      </div>

      <Flex direction="flex-col" className="px-4">
        <TimetableSubjectCards
          collapseSheet={() => setSnapPoint(previewSnapPoint)}
          subjects={filteredData}
          isPending={isPending}
        />
      </Flex>
    </BottomSheet>
  );
}

export default ScheduleSearchBottomSheet;
