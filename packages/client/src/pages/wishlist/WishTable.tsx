import {useState, useEffect} from 'react';
import useWishes from '@/hooks/server/useWishes.ts';
import Table, {TableHeaders} from '@/components/wishTable/Table.tsx';
import Searches, {WishSearchParams} from '@/components/dashboard/Searches.tsx';
import {Wishes} from '@/utils/types..ts';
import useFavorites from '@/store/useFavorites.ts';
import SkeletonTable from '@/components/skeletons/SkeletonTable.tsx';

function WishTable() {
  const [filterParams, setFilterParams] = useState<WishSearchParams>({searchInput: '', selectedDepartment: '', isFavorite: false});
  const [filteredData, setFilteredData] = useState<Wishes[]>([]);
  const pickedFavorites = useFavorites(state => state.isFavorite);
  const {data: wishes, isPending} = useWishes();

  useEffect(() => {
    setFilteredData(filterData(wishes, pickedFavorites, filterParams));
  }, [filterParams, wishes]);

  return (
    <div className="max-w-screen-xl mx-auto p-2 mb-8">
      <div className="container p-4 mx-auto">

        {/* Header */}
        <div className="p-6">
          <h1 className="text-2xl font-bold">수강신청 관심과목 분석</h1>

          {/* Search and Filter */}
          <Searches setSearches={setFilterParams}/>

          {/* Course Table */}
          <div className="bg-white mt-6 shadow-md rounded-lg overflow-x-auto">
            {isPending ? (
              <SkeletonTable headerNames={TableHeaders.map(({name})=> name)}/>
            ) : (
              filteredData && <Table data={filteredData}/>
            )}
          </div>
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
