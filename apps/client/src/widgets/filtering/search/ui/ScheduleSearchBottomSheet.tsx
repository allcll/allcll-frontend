import { useDeferredValue, useEffect, useState } from 'react';
import BottomSheet from '@/shared/ui/bottomsheet/BottomSheet.tsx';
import TimetableSubjectCards from '@/features/timetable/ui/subject/TimetableSubjectCards.tsx';
import SearchBox from '@/features/filtering/ui/SearchBox.tsx';
import useScheduleModal from '@/features/timetable/lib/useScheduleModal.ts';
import useFilteringSubjects from '@/features/filtering/lib/useFilteringSubjects.ts';
import { useScheduleSearchStore } from '@/features/filtering/model/useFilterStore.ts';
import { ScheduleAdapter } from '@/entities/timetable/model/adapter.ts';
import { AddIcon, Button, Flex } from '@allcll/allcll-ui';
import FilteringButton from '@/features/filtering/ui/button/FilteringButton.tsx';
import useWishes from '@/entities/wishes/model/useWishes.ts';
import useSearchRank from '@/features/filtering/lib/useSearchRank.ts';
import { useSemesterParam } from '@/entities/semester/model/useSemesterParam.ts';

interface ISearchBottomSheet {
  isOpen: boolean;
  onCloseSearch: () => void;
  onOpenFiltering: () => void;
}

function ScheduleSearchBottomSheet({ isOpen, onCloseSearch, onOpenFiltering }: ISearchBottomSheet) {
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

  useEffect(() => {
    if (isOpen) setSnapPoint(1);
  }, [isOpen]);

  return (
    <BottomSheet
      title="과목 검색"
      isOpen={isOpen}
      onClose={onCloseSearch}
      snapPoints={[previewSnapPoint, 1]}
      activeSnapPoint={snapPoint}
      onActiveSnapPointChange={setSnapPoint}
    >
      <div className="sticky -mx-4 px-4 top-0 bg-white z-content flex items-stretch gap-2 pb-3 mb-4 border-b border-gray-100">
        <SearchBox
          type="text"
          placeholder="과목명, 교수명, 학수번호 검색"
          value={keywords}
          onChange={e => setFilter('keywords', e.target.value)}
          onDelete={() => setFilter('keywords', '')}
          className="w-full"
        />

        <FilteringButton
          handleOpenFilter={onOpenFiltering}
          className="shrink-0 w-[38px] max-sm:pointer-coarse:w-[42px]"
        />
      </div>

      <Flex direction="column" gap={3}>
        <Button variant="text" size="small" onClick={() => openScheduleModal(initSchedule)}>
          <AddIcon />
          커스텀 일정 생성
        </Button>

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
