import {useState, useEffect, ChangeEvent} from 'react';
import SearchSvg from '@/assets/search.svg?react';
import StarSvg from '@/assets/star.svg?react';
import useWishes from '@/hooks/server/useWishes.ts';
import {Wishes} from '@/utils/types..ts';
import Table from '@/components/wishTable/Table.tsx';

function WishTable() {
  const [selectedDepartment, setSelectedDepartment] = useState('전체 학과');
  const [searchInput, setSearchInput] = useState('');
  const [filteredData, setFilteredData] = useState<Wishes[]>([]);
  const {data, isPending} = useWishes();

  useEffect(() => {
    const handler = setTimeout(() => {
      if (data) {
        setFilteredData(filterData(data, searchInput, selectedDepartment));
      }
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [data, searchInput, selectedDepartment]);

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleDepartmentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(event.target.value);
  };

  return (
    <div className="max-w-screen-xl mx-auto p-2 mb-8">
      <div className="container p-4 mx-auto">

        {/* Header */}
        <div className="p-6">
          <h1 className="text-2xl font-bold">수강신청 관심과목 분석</h1>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row md:items-center mt-4 space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative w-full md:w-1/2">
              <SearchSvg className="absolute left-3 top-3 text-gray-500"/>
              <input type="text"
                     placeholder="과목명 또는 교수명 검색"
                     className="pl-10 pr-4 py-2 border rounded-md w-full"
                     onChange={handleSearchInputChange}/>
            </div>
            <select
              className="border px-4 py-2 rounded-md"
              onChange={handleDepartmentChange}
            >
              <option>전체 학과</option>
              <option>컴퓨터공학과</option>
            </select>
            <button className="border px-4 py-2 rounded-md flex items-center">
              <StarSvg className="w-4 h-4 mr-1"/> 즐겨찾기만 보기
            </button>
          </div>

          {/* Course Table */}
          <div className="bg-white mt-6 shadow-md rounded-lg overflow-x-auto">
            {isPending ? (
              <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <h1 className="text-2xl font-bold">Loading...</h1>
              </div>
            ) : (
              filteredData && <Table data={filteredData}/>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function filterData(data: Wishes[]|undefined, searchInput: string, selectedDepartment: string) {
  if (!data) return [];

  return data.filter(item => {
    const matchesProfessor = item.professorName.toLowerCase().includes(searchInput.toLowerCase());
    const matchesSubject = item.subjectName.toLowerCase().includes(searchInput.toLowerCase());
    const matchesDepartment = selectedDepartment === '전체 학과' || item.departmentName === selectedDepartment;

    return (matchesProfessor || matchesSubject) && matchesDepartment;
  });
}

export default WishTable;
