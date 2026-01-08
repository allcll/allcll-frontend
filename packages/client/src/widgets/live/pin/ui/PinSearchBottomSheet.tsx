import { useDeferredValue, useState } from 'react';
import BottomSheet from '@/shared/ui/bottomsheet/BottomSheet.tsx';
import BottomSheetHeader from '@/shared/ui/bottomsheet/BottomSheetHeader.tsx';
import useWishes from '@/entities/wishes/model/useWishes.ts';
import { initialFilters } from '@/features/filtering/model/useFilterStore.ts';
import PinCards from './PinCards';
import DepartmentSelect from '../../../../entities/departments/ui/DepartmentSelect';
import useSearchRank from '@/features/filtering/lib/useSearchRank.ts';
import useFilteringSubjects from '@/features/filtering/lib/useFilteringSubjects.ts';
import SearchBox from '@/features/filtering/ui/SearchBox.tsx';

interface ISearchBottomSheet {
  onCloseSearch: () => void;
}

function PinSearchBottomSheet({ onCloseSearch }: ISearchBottomSheet) {
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
            <DepartmentSelect
              className="flex-auto"
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
            />
          </div>

          <div className="max-h-[70vh] min-h-0 px-2 overflow-y-auto touch-auto flex flex-col">
            <PinCards
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

export default PinSearchBottomSheet;
