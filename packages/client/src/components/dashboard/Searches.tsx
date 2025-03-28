import {ChangeEvent, useEffect} from 'react';
import StarIcon from '@/components/svgs/StarIcon.tsx';
import useDepartments from '@/hooks/server/useDepartments.ts';
import useWishSearchStore from "@/store/useWishSearchStore.ts";
import SearchBox from "@/components/common/SearchBox.tsx";

export interface WishSearchParams {
  searchInput: string;
  selectedDepartment: string;
  isFavorite: boolean;
}

function Searches() {
  const selectedDepartment = useWishSearchStore(state => state.selectedDepartment);
  const searchInput = useWishSearchStore(state => state.searchInput);
  const isFavorite = useWishSearchStore(state => state.isFavorite);
  const setSearchInput = useWishSearchStore(state => state.setSearchInput);
  const setSelectedDepartment = useWishSearchStore(state => state.setSelectedDepartment);
  const setToggleFavorite = useWishSearchStore(state => state.setToggleFavorite);
  const setSearchParams = useWishSearchStore(state => state.setSearchParams);

  const {data: departments} = useDepartments();

  const departmentsList = [
    {departmentName: '전체 학과', departmentCode: ""},
    ...(departments ?? [])
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams({searchInput, selectedDepartment, isFavorite});
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput, selectedDepartment]);

  useEffect(() => {
    setSearchParams({searchInput, selectedDepartment, isFavorite});
  }, [selectedDepartment, isFavorite]);


  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleDepartmentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(event.target.value);
  };

  const handleFavoriteChange = () => {
    setToggleFavorite();
  }

  return (
    <div className="flex flex-col space-y-4 mt-4 text-sm lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
      <SearchBox
        type="text"
        placeholder="과목명 또는 교수명 검색"
        className="pl-10 pr-4 py-2 rounded-md w-full bg-white border border-gray-400"
        value={searchInput}
        onDelete={() => setSearchInput('')}
        onChange={handleSearchInputChange} />
      <label htmlFor="department" className="hidden">학과</label>
      <select
        id="department"
        className="pl-2 pr-4 py-2 rounded-md bg-white border border-gray-400"
        value={selectedDepartment}
        onChange={handleDepartmentChange}
      >
        {departmentsList.map(({departmentName, departmentCode}) => (
          <option key={departmentCode} value={departmentCode}>
            {departmentName}
          </option>
        ))}
      </select>
      <button className="px-4 py-2 rounded-md flex gap-2 items-center text-nowrap border border-gray-400 hover:bg-white"
              onClick={handleFavoriteChange}>
        <StarIcon disabled={!isFavorite}/> 즐겨찾기
      </button>
    </div>
  );
}

export default Searches;