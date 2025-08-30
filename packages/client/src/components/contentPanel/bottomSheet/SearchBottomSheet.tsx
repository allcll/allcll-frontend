import { useDeferredValue } from 'react';
import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import { FilteredSubjectCards } from '../subject/FilteredSubjectCards';
import SearchBox from '@/components/common/SearchBox';
import useSubject from '@/hooks/server/useSubject';
import useScheduleModal from '@/hooks/useScheduleModal.ts';
import useFilteringSubjects from '@/hooks/useFilteringSubjects';
import { useScheduleSearchStore } from '@/store/useFilterStore.ts';
import { BottomSheetType } from '@/store/useBottomSheetStore';
import { ScheduleAdapter } from '@/utils/timetable/adapter';
import FilterSvg from '@/assets/filter.svg?react';

interface ISearchBottomSheet {
  onCloseSearch: (bottomSheetType: BottomSheetType) => void;
}

function SearchBottomSheet({ onCloseSearch }: ISearchBottomSheet) {
  const { data: subjects = [], isPending } = useSubject();
  const { openScheduleModal, cancelSchedule } = useScheduleModal();
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
            onClose={cancelSchedule}
            onClick={() => openScheduleModal(initSchedule)}
          />

          <div className="sticky px-2 top-0 bg-white z-10 flex items-center gap-2 py-3">
            <SearchBox
              type="text"
              placeholder="과목명 및 교수명 검색"
              value={keywords}
              onChange={e => setFilter('keywords', e.target.value)}
              onDelete={() => setFilter('keywords', '')}
              className="pl-10 pr-6 py-2 rounded-md w-full bg-white border border-gray-400 text-[16px]"
            />
            <button className="w-20 justify-center flex cursor-pointer" onClick={() => onCloseSearch('filter')}>
              <FilterSvg className="w-6 h-6" />
            </button>
          </div>

          <div className="max-h-[70vh] min-h-0 px-2 overflow-y-auto touch-auto flex flex-col">
            <FilteredSubjectCards expandToMax={expandToMax} subjects={filteredData} isPending={isPending} />
          </div>
        </>
      )}
    </BottomSheet>
  );
}

export default SearchBottomSheet;
