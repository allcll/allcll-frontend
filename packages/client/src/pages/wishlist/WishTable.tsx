import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import { disassemble } from 'es-hangul';
import useWishes from '@/hooks/server/useWishes.ts';
import Table from '@/components/wishTable/Table.tsx';
import Searches, { WishSearchParams } from '@/components/live/Searches.tsx';
import { Wishes } from '@/utils/types.ts';
import useFavorites from '@/store/useFavorites.ts';
import useWishSearchStore from '@/store/useWishSearchStore.ts';

function WishTable() {
  const filterParams = useWishSearchStore(state => state.searchParams);
  const [filteredData, setFilteredData] = useState<Wishes[]>([]);
  const pickedFavorites = useFavorites(state => state.isFavorite);
  const { data: wishes, isPending } = useWishes();

  useEffect(() => {
    setFilteredData(filterData(wishes, pickedFavorites, filterParams));
  }, [filterParams, wishes]);

  return (
    <>
      <Helmet>
        <title>ALLCLL | 관심과목 분석</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 md:px-16 mb-8">
        {/* Header */}
        <div className="py-12 px-2">
          <h1 className="text-2xl font-bold">관심과목 분석</h1>
          <p className="text-gray-500 mt-2">
            올클은 세종대학교의 <span className="text-blue-500 font-bold">실제 데이터</span>를 보여드립니다. 관심과목을
            선택하여 분석해보세요.
          </p>

          {/* Search and Filter */}
          <Searches />

          {/* Course Table */}
          <div className="bg-white mt-6 shadow-md rounded-lg overflow-x-auto">
            <Table data={filteredData} isPending={isPending} />
          </div>
        </div>
      </div>
    </>
  );
}

// Todo: upgrade search function
function filterData(
  data: Wishes[] | undefined,
  pickedFavorites: (id: number) => boolean,
  { searchInput, selectedDepartment, isFavorite }: WishSearchParams,
): Wishes[] {
  if (!data) return [];

  const cleanSearchInput = searchInput.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
  const disassembledSearchInput = disassemble(cleanSearchInput).toLowerCase();

  return data.filter(item => {
    const disassembledProfessorName = item.professorName ? disassemble(item.professorName).toLowerCase() : '';
    const cleanSubjectName = item.subjectName.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    const disassembledSubjectName = disassemble(cleanSubjectName).toLowerCase();

    const matchesProfessor = disassembledProfessorName.includes(disassembledSearchInput);
    const matchesSubject = disassembledSubjectName.includes(disassembledSearchInput);
    const matchesDepartment = selectedDepartment === '' || item.departmentCode === selectedDepartment;
    const matchesFavorite = isFavorite ? pickedFavorites(item.subjectId) : true;

    return (matchesProfessor || matchesSubject) && matchesDepartment && matchesFavorite;
  });
}

export default WishTable;
