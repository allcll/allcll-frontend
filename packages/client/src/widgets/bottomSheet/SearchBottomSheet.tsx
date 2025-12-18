import { useDeferredValue } from 'react';
import BottomSheet from '../../shared/ui/bottomsheet/BottomSheet.tsx';
import BottomSheetHeader from '../../shared/ui/bottomsheet/BottomSheetHeader.tsx';
import { FilteredSubjectCards } from '../../components/contentPanel/subject/TimetableSubjectCards.tsx';
import SearchBox from '@/features/filtering/ui/SearchBox.tsx';
import useSubject from '@/entities/subjects/api/useSubject.ts';
import useScheduleModal from '@/hooks/useScheduleModal.ts';
import useFilteringSubjects from '@/hooks/useFilteringSubjects.ts';
import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import { ScheduleAdapter } from '@/utils/timetable/adapter.ts';
import FilterSvg from '@/assets/filter.svg?react';
import { Flex, IconButton } from '../../../../allcll-ui';

interface ISearchBottomSheet {
  onCloseSearch: () => void;
}

function SearchBottomSheet({ onCloseSearch }: ISearchBottomSheet) {
  const { data: subjects = [], isPending } = useSubject();
  const { openScheduleModal } = useScheduleModal();
  const filters = useScheduleSearchStore(state => state.filters);
  const setFilter = useScheduleSearchStore(state => state.setFilter);
  const { keywords } = filters;

  const filteredData = useDeferredValue(useFilteringSubjects(subjects, filters));

  const initSchedule = new ScheduleAdapter().toUiData();

  return (
    <BottomSheet>
      {({ expandToMax }) => (
        <>
          <BottomSheetHeader
            title="과목검색"
            headerType="add"
            onClose={onCloseSearch}
            onClick={() => openScheduleModal(initSchedule)}
          />

          <div className="sticky px-2 top-0 bg-white z-10 flex items-center gap-2 py-3">
            <SearchBox
              type="text"
              placeholder="과목명 및 교수명 검색"
              value={keywords}
              onChange={e => setFilter('keywords', e.target.value)}
              onDelete={() => setFilter('keywords', '')}
              className="w-full"
            />

            <IconButton
              aria-label="filter"
              variant="plain"
              label="filter"
              icon={<FilterSvg className="w-6 h-6" />}
              onClick={() => onCloseSearch()}
            />
          </div>

          <Flex direction="flex-col" className="max-h-[70vh] min-h-0 px-2 overflow-y-auto touch-auto">
            <FilteredSubjectCards expandToMax={expandToMax} subjects={filteredData} isPending={isPending} />
          </Flex>
        </>
      )}
    </BottomSheet>
  );
}

export default SearchBottomSheet;
