import { useDeferredValue, useState } from 'react';
import SearchBox from '@/features/filtering/ui/SearchBox.tsx';
import BottomSheet from '@/shared/ui/bottomsheet/BottomSheet.tsx';
import BottomSheetHeader from '@/shared/ui/bottomsheet/BottomSheetHeader.tsx';
import useFilteringSubjects from '@/hooks/useFilteringSubjects.ts';
import useWishes from '@/entities/wishes/api/useWishes.ts';
import useSearchRank from '@/hooks/useSearchRank.ts';
import DepartmentFilter from '@/widgets/live/DepartmentFilter.tsx';
import SubjectCards from '@/widgets/live/subjectTable/SubjectCards.tsx';
import { initialFilters } from '@/store/useFilterStore.ts';

interface ISearchBottomSheet {
  onCloseSearch: () => void;
}

function SearchBottomSheet({ onCloseSearch }: ISearchBottomSheet) {
  const [searchInput, setSearchInput] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const { data: wishes, isPending } = useWishes();
  const data = useSearchRank(wishes);

  const filteredData = useDeferredValue(
    useFilteringSubjects(data ?? [], {
      ...initialFilters,
      keywords: searchInput,
      department: selectedDepartment,
    }),
  );

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
              className="w-full"
            />
            <DepartmentFilter
              className="flex-auto"
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
            />
          </div>

          <div className="max-h-[70vh] min-h-0 px-2 overflow-y-auto touch-auto flex flex-col">
            <SubjectCards
              className="flex flex-full overflow-auto max-h-screen"
              subjects={filteredData}
              isPending={isPending}
            />
          </div>
        </>
      )}
    </BottomSheet>
  );
}

export default SearchBottomSheet;
