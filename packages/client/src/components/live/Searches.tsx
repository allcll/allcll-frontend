import { ChangeEvent, useEffect } from 'react';
import StarIcon from '@/components/svgs/StarIcon.tsx';
import useDepartments from '@/hooks/server/useDepartments.ts';
import useWishSearchStore from '@/store/useWishSearchStore.ts';
import SearchBox from '@/components/common/SearchBox.tsx';
import AlarmIcon from '@/components/svgs/AlarmIcon.tsx';

export interface WishSearchParams {
  searchInput: string;
  selectedDepartment: string;
  isFavorite: boolean;
}

function Searches() {
  const selectedDepartment = useWishSearchStore(state => state.selectedDepartment);
  const searchInput = useWishSearchStore(state => state.searchInput);
  const isFavorite = useWishSearchStore(state => state.isFavorite);
  const isPinned = useWishSearchStore(state => state.isPinned);
  const setSearchInput = useWishSearchStore(state => state.setSearchInput);
  const setSelectedDepartment = useWishSearchStore(state => state.setSelectedDepartment);
  const setToggleFavorite = useWishSearchStore(state => state.setToggleFavorite);
  const setTogglePinned = useWishSearchStore(state => state.setTogglePinned);
  const setSearchParams = useWishSearchStore(state => state.setSearchParams);

  const { data: departments } = useDepartments();

  const departmentsList = [{ departmentName: '전체', departmentCode: '' }, ...(departments ?? [])];

  useEffect(() => {
    setSearchParams({ searchInput, selectedDepartment, isFavorite });
  }, [searchInput, selectedDepartment, isFavorite]);

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleDepartmentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(event.target.value);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4 text-sm lg:flex-nowrap lg:flex-row lg:items-center lg:gap-y-0 lg:gap-x-2">
      <SearchBox
        type="text"
        placeholder="과목명 또는 교수명 검색"
        className="pl-10 pr-4 py-2 rounded-md w-full bg-white border border-gray-400"
        value={searchInput}
        onDelete={() => setSearchInput('')}
        onChange={handleSearchInputChange}
      />
      <label htmlFor="department" className="hidden">
        학과
      </label>
      <select
        id="department"
        className="pl-2 pr-4 py-2 rounded-md bg-white border border-gray-400"
        style={{ maxWidth: 'calc(100vw - 64px)' }}
        value={selectedDepartment}
        onChange={handleDepartmentChange}
      >
        {departmentsList.map(({ departmentName, departmentCode }) => (
          <option key={departmentCode} value={departmentCode}>
            {departmentName}
          </option>
        ))}
      </select>

      <div className="flex items-center space-x-2">
        <button
          className="p-2 rounded-md flex gap-2 items-center border border-gray-400 bg-white hover:bg-gray-100"
          onClick={setToggleFavorite}
          aria-label={isFavorite ? '즐겨찾기 필터 제거' : '즐겨찾기 필터 추가'}
          title={isFavorite ? '즐겨찾기 필터 제거' : '즐겨찾기 필터 추가'}
        >
          <StarIcon disabled={!isFavorite} />
        </button>

        <button
          className="p-2 rounded-md flex gap-2 items-center border border-gray-400 bg-white hover:bg-gray-100"
          onClick={setTogglePinned}
          aria-label={isFavorite ? '알림과목 필터 제거' : '알림과목 필터 추가'}
          title={isFavorite ? '알림과목 필터 제거' : '알림과목 필터 추가'}
        >
          <AlarmIcon disabled={!isPinned} />
        </button>
      </div>
    </div>
  );
}

export default Searches;
