import { useDeferredValue, useEffect, useState } from 'react';
import SearchBox from '@/components/common/SearchBox';
import BottomSheet from '@/components/contentPanel/bottomSheet/BottomSheet';
import BottomSheetHeader from '@/components/contentPanel/bottomSheet/BottomSheetHeader';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import useFilteringSubjects from '@/hooks/useFilteringSubjects';
import useSearchRank from '@/hooks/useSearchRank.ts';
import DepartmentFilter from '@/components/live/DepartmentFilter.tsx';
import SubjectCards from '@/components/live/subjectTable/SubjectCards.tsx';
import useAlarmSearchStore from '@/store/useAlarmSearchStore.ts';
import useWishesPreSeats from '@/hooks/useWishesPreSeats';
import useWishes from '@/hooks/server/useWishes';

interface ISearchBottomSheet {
  onCloseSearch: () => void;
  hasPreSeat: boolean;
}

const TableHeadTitles = [
  { title: '알림', key: 'pin' },
  { title: '학수번호', key: 'code' },
  { title: '개설학과', key: 'departmentName' },
  { title: '과목명', key: 'name' },
  { title: '담당교수', key: 'professor' },
  // {title: "학점", key: "credits"}
];

function SearchBottomSheet({ onCloseSearch, hasPreSeat }: ISearchBottomSheet) {
  const [searchInput, setSearchInput] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const openBottomSheet = useBottomSheetStore(state => state.openBottomSheet);
  const closeBottomSheet = useBottomSheetStore(state => state.closeBottomSheet);
  const isSearchOpen = useAlarmSearchStore(state => state.isSearchOpen);

  const { data: wishes, isPending } = useWishes();
  const { data: preSeatWishes, isPending: preSeatIsPending } = useWishesPreSeats(TableHeadTitles);

  const data = useSearchRank(hasPreSeat ? wishes : preSeatWishes);

  const filteredData = useDeferredValue(
    useFilteringSubjects({
      subjects: data ?? [],
      searchKeywords: searchInput,
      selectedDepartment: selectedDepartment,
    }),
  );

  useEffect(() => {
    if (!isSearchOpen) {
      closeBottomSheet();
    } else {
      openBottomSheet('search');
    }
  }, [isSearchOpen]);

  return (
    <BottomSheet>
      {({ expandToMax }) => (
        <>
          <BottomSheetHeader
            title="알림과목검색"
            headerType="close"
            onClose={() => onCloseSearch()}
            onClick={expandToMax}
          />

          <div className="sticky py-3 px-2 top-0 bg-white z-10 flex flex-col gap-2 mb-4 flex-auto">
            <SearchBox
              placeholder="과목명 교수명 검색"
              onChange={e => setSearchInput(e.target.value)}
              onDelete={() => setSearchInput('')}
            />
            <DepartmentFilter
              className="flex-auto"
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
            />
          </div>

          <div className="max-h-[70vh] min-h-0 px-2 overflow-y-auto touch-auto flex flex-col">
            {/* Search Results */}
            <SubjectCards
              className="flex flex-full overflow-auto max-h-screen"
              subjects={filteredData}
              isPending={hasPreSeat ? isPending : preSeatIsPending}
            />
          </div>
        </>
      )}
    </BottomSheet>
  );
}

export default SearchBottomSheet;
