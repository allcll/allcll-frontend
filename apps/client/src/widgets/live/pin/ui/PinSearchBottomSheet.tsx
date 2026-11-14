import { useDeferredValue, useState } from 'react';
import BottomSheet from '@/shared/ui/bottomsheet/BottomSheet.tsx';
import useWishes from '@/entities/wishes/model/useWishes.ts';
import { initialFilters } from '@/features/filtering/model/useFilterStore.ts';
import PinCards from './PinCards';
import DepartmentSelect from '@/entities/departments/ui/DepartmentSelect';
import useSearchRank from '@/features/filtering/lib/useSearchRank.ts';
import useFilteringSubjects from '@/features/filtering/lib/useFilteringSubjects.ts';
import SearchBox from '@/features/filtering/ui/SearchBox.tsx';

interface ISearchBottomSheet {
  isOpen: boolean;
  onCloseSearch: () => void;
}

function PinSearchBottomSheet({ isOpen, onCloseSearch }: ISearchBottomSheet) {
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

  const handleClose = () => {
    setSearchInput('');
    setSelectedDepartment('');
    onCloseSearch();
  };

  return (
    // 검색 결과 수에 따라 시트 높이가 출렁이지 않도록 화면 높이로 고정
    <BottomSheet title="알림 과목 등록" isOpen={isOpen} onClose={handleClose} snapPoints={[1]}>
      <div className="sticky -mx-4 pb-3 px-4 top-0 bg-surface z-content flex flex-col gap-2 mb-4 border-b border-line-subtle">
        <SearchBox
          placeholder="과목명, 교수명, 학수번호 검색"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onDelete={() => setSearchInput('')}
          className="w-full"
        />
        <DepartmentSelect
          className="flex-auto"
          value={selectedDepartment}
          onChange={code => setSelectedDepartment(code)}
        />
      </div>

      <div className="flex flex-col">
        <PinCards subjects={filteredData} isPending={isPending} />
      </div>
    </BottomSheet>
  );
}

export default PinSearchBottomSheet;
