import SearchBox from '@/components/common/SearchBox';
import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import FilterSvg from '@/assets/Filter.svg?react';
import { FilteredSubjectCards } from '../subject/FilteredSubjectCards';
import { useState } from 'react';
import useWishes from '@/hooks/server/useWishes';
import { Wishes } from '@/utils/types';

function SearchBottomSheet() {
  const [searchKeywords, setSearchKeywords] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Wishes[]>([]);
  const { data: subjects, isPending } = useWishes();

  return (
    <BottomSheet>
      <BottomSheetHeader title="과목검색" headerType="add" onClose={() => {}} />

      <div className="flex items-center flex gap-2 py-3">
        <SearchBox
          onDelete={() => {}}
          className="pl-10 pr-6 py-2 rounded-md w-full bg-white border border-gray-400 text-sm"
          placeholder="과목명 및 교수명 검색"
        />
        <button className="w-20 justify-center flex cursor-pointer">
          <FilterSvg className="w-6 h-6" />
        </button>
      </div>

      <div className="overflow-y-auto max-h-screen">
        <FilteredSubjectCards
          subjects={subjects ?? []}
          isPending={isPending}
          selectedDepartment={'전체'}
          selectedGrades={[]}
          selectedDays={[]}
        />
      </div>
    </BottomSheet>
  );
}

export default SearchBottomSheet;
