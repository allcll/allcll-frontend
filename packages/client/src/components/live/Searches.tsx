import { useState, ChangeEvent } from 'react';
import StarIcon from '@/components/svgs/StarIcon.tsx';
import SearchBox from '@/components/common/SearchBox.tsx';
// import AlarmIcon from '@/components/svgs/AlarmIcon.tsx';
import DepartmentFilter from '@/components/live/DepartmentFilter.tsx';
import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import DraggableList from '@/components/live/subjectTable/DraggableList.tsx';
import FilteringModal from '@/components/wishTable/FilteringModal.tsx';
import { useWishSearchStore } from '@/store/useFilterStore.ts';
import { HeadTitle, useWishesTableStore } from '@/store/useTableColumnStore.ts';
import { IPreRealSeat } from '@/hooks/server/usePreRealSeats.ts';
import useBackSignal from '@/hooks/useBackSignal.ts';
import { Wishes } from '@/utils/types.ts';
import ListSvg from '@/assets/list.svg?react';
import FilterSvg from '@/assets/filter.svg?react';

export interface WishSearchParams {
  searchInput: string;
  selectedDepartment: string;
  isFavorite: boolean;
}

function Searches() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const filters = useWishSearchStore(state => state.filters);
  const setFilter = useWishSearchStore(state => state.setFilter);
  const { keywords, department, favoriteOnly } = filters;

  const tableTitles = useWishesTableStore(state => state.tableTitles);
  const setTableTitles = useWishesTableStore(state => state.setTableTitles);

  const setToggleFavorite = () => setFilter('favoriteOnly', !favoriteOnly);

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter('keywords', event.target.value);
  };

  const handleDepartmentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFilter('department', event.target.value);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4 text-sm lg:flex-nowrap lg:flex-row lg:items-center lg:gap-y-0 lg:gap-x-2">
      {isModalOpen && (
        <LiveTableTitleModal
          initialItems={tableTitles}
          onChange={setTableTitles}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isFilterModalOpen && <FilteringModal onClose={() => setIsFilterModalOpen(false)} />}
      <SearchBox
        type="text"
        placeholder="과목명, 교수명 또는 학수번호 및 분반 검색"
        className="pl-10 pr-4 py-2 rounded-md w-full bg-white border border-gray-400"
        value={keywords}
        onDelete={() => setFilter('keywords', '')}
        onChange={handleSearchInputChange}
      />
      <DepartmentFilter
        value={department}
        style={{ maxWidth: 'calc(100vw - 64px)' }}
        onChange={handleDepartmentChange}
      />

      <div className="flex items-center space-x-2">
        <button
          className="p-2 rounded-md flex gap-2 items-center border border-gray-400 bg-white hover:bg-gray-100"
          onClick={setToggleFavorite}
          aria-label={favoriteOnly ? '즐겨찾기 필터 제거' : '즐겨찾기 필터 추가'}
          title={favoriteOnly ? '즐겨찾기 필터 제거' : '즐겨찾기 필터 추가'}
        >
          <StarIcon disabled={!favoriteOnly} />
        </button>

        {/* <button
          className="p-2 rounded-md flex gap-2 items-center border border-gray-400 bg-white hover:bg-gray-100"
          onClick={setTogglePinned}
          aria-label={isFavorite ? '알림과목 필터 제거' : '알림과목 필터 추가'}
          title={isFavorite ? '알림과목 필터 제거' : '알림과목 필터 추가'}
        >
          <AlarmIcon disabled={!isPinned} />
        </button> */}

        <button
          className="p-2 rounded-md flex gap-2 items-center border border-gray-400 bg-white hover:bg-gray-100"
          aria-label="필터 수정"
          title="필터 수정"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <FilterSvg className="w-4 h-4 text-gray-600 hover:text-blue-500 transition-colors" />
        </button>

        <button
          className="p-2 rounded-md flex gap-2 items-center border border-gray-400 bg-white hover:bg-gray-100"
          aria-label="테이블 수정"
          title="테이블 수정"
          onClick={() => setIsModalOpen(true)}
        >
          <ListSvg className="w-4 h-4 text-gray-600 hover:text-blue-500 transition-colors" />
        </button>
      </div>
    </div>
  );
}

interface ITableTitleModal {
  initialItems: HeadTitle<Wishes & IPreRealSeat>[];
  onChange: (items: HeadTitle<Wishes & IPreRealSeat>[]) => void;
  onClose: () => void;
}

function LiveTableTitleModal({ initialItems, onChange, onClose }: ITableTitleModal) {
  useBackSignal({
    enabled: true,
    onClose: onClose,
  });

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="테이블 설정" onClose={onClose} />
      <div className="p-4">
        <DraggableList initialItems={initialItems} onChange={onChange} />
      </div>
    </Modal>
  );
}

export default Searches;
