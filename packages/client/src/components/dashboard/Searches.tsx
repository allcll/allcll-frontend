import useDepartments from '@/hooks/server/useDepartments.ts';
import SearchSvg from '@/assets/search.svg?react';
import {ChangeEvent, useEffect, useState} from 'react';
import StarIcon from '@/components/svgs/StarIcon.tsx';

export interface WishSearchParams {
  searchInput: string;
  selectedDepartment: string;
  isFavorite: boolean;
}

interface SearchesProps {
  setSearches: (searches: WishSearchParams) => void;
}

function Searches({setSearches}: SearchesProps) {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const {data: departments} = useDepartments();

  const departmentsList = [
    {departmentName: '전체 학과', departmentCode: ""},
    ...(departments ?? [])
  ];


  useEffect(() => {
    const handler = setTimeout(() => {
      setSearches({searchInput, selectedDepartment, isFavorite});
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput, selectedDepartment]);

  useEffect(() => {
    setSearches({searchInput, selectedDepartment, isFavorite});
  }, [selectedDepartment, isFavorite]);


  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleDepartmentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(event.target.value);
  };

  const handleFavoriteChange = () => {
    setIsFavorite(prevState => !prevState);
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center mt-4 space-y-4 md:space-y-0 md:space-x-4 text-sm">
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
        {departmentsList.map(({departmentName, departmentCode}) => (
          <option key={departmentCode} value={departmentCode}>
            {departmentName}
          </option>
        ))}
      </select>
      <button className="border px-4 py-2 rounded-md flex gap-2 items-center text-nowrap hover:bg-white"
              onClick={handleFavoriteChange}>
        <StarIcon disabled={!isFavorite}/> 즐겨찾기
      </button>
    </div>
  );
}

export default Searches;