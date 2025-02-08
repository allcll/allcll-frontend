import {useState, useEffect} from 'react';
import useWishes from '@/hooks/server/useWishes.ts';
import Table from '@/components/wishTable/Table.tsx';
import Searches, {WishSearchParams} from '@/components/dashboard/Searches.tsx';
import {Wishes} from '@/utils/types.ts';
import useFavorites from '@/store/useFavorites.ts';

function WishTable() {
  const [filterParams, setFilterParams] = useState<WishSearchParams>({searchInput: '', selectedDepartment: '', isFavorite: false});
  const [filteredData, setFilteredData] = useState<Wishes[]>([]);
  const pickedFavorites = useFavorites(state => state.isFavorite);
  const {data: wishes, isPending} = useWishes();

  useEffect(() => {
    setFilteredData(filterData(wishes, pickedFavorites, filterParams));
  }, [filterParams, wishes]);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-16 mb-8">
      {/* Header */}
      <div className="py-12 px-2">
        <h1 className="text-2xl font-bold">수강신청 관심과목 분석</h1>
        <p className="text-gray-500 mt-2">
          올클은 세종대학교의 <span className="text-green-500 font-bold">실제 데이터</span>를 보여드립니다. 관심과목을 선택하여 분석해보세요.
        </p>

        {/* Search and Filter */}
        <Searches setSearches={setFilterParams}/>

        {/* Course Table */}
        <div className="bg-white mt-6 shadow-md rounded-lg overflow-x-auto">
          <Table data={filteredData} isPending={isPending}/>
        </div>
      </div>
    </div>
  );
}

function filterData(data: Wishes[]|undefined, pickedFavorites: (id: number)=>boolean, {searchInput, selectedDepartment, isFavorite}: WishSearchParams): Wishes[] {
  if (!data) return [];

  return data.filter(item => {
    const matchesProfessor = !!item.professorName && item.professorName.toLowerCase().includes(searchInput.toLowerCase());
    const matchesSubject = item.subjectName.toLowerCase().includes(searchInput.toLowerCase());
    const matchesDepartment = selectedDepartment === "" || item.departmentCode === selectedDepartment;
    const matchesFavorite = isFavorite ? pickedFavorites(item.subjectId) : true;

    return (matchesProfessor || matchesSubject) && matchesDepartment && matchesFavorite;
  });
}

export default WishTable;
