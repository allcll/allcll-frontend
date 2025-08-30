import React, { useDeferredValue, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import SearchBox from '@/components/common/SearchBox.tsx';
import DepartmentFilter from '@/components/live/DepartmentFilter.tsx';
import SubjectCards from '@/components/live/subjectTable/SubjectCards.tsx';
import useSearchRank from '@/hooks/useSearchRank.ts';
import useFilteringSubjects from '@/hooks/useFilteringSubjects.ts';
import useWishes from '@/hooks/server/useWishes.ts';
import XSvg from '@/assets/x.svg?react';

interface SearchSideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const transitionClasses = {
  enter: 'sidebar-transition-enter',
  enterActive: 'sidebar-transition-enter-active',
  exit: 'sidebar-transition-exit',
  exitActive: 'sidebar-transition-exit-active',
};

const SearchSideBar: React.FC<SearchSideBarProps> = ({ isOpen, onClose }) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const { data: wishes, isPending } = useWishes();
  const data = useSearchRank(wishes);

  const filteredData = useDeferredValue(
    useFilteringSubjects({
      subjects: data ?? [],
      searchKeywords: searchInput,
      selectedDepartment: selectedDepartment,
    }),
  );

  return (
    <>
      {/*<CSSTransition in={isOpen} timeout={300} classNames="overlay-transition" unmountOnExit>*/}
      {/*  <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />*/}
      {/*</CSSTransition>*/}

      <CSSTransition in={isOpen} timeout={100} classNames={transitionClasses} unmountOnExit>
        <div className="flex flex-col w-92 flex-auto bg-gray-50 shadow-lg z-10">
          <div className="flex justify-between items-center py-2 pl-4 pr-2 bg-white border-b border-gray-200">
            <h2 className="text-md font-bold">알림 설정</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <XSvg className="w-3 h-3" />
            </button>
          </div>

          {/*Search Component*/}
          <div className="flex-1 p-4">
            <div className="flex flex-col gap-2 mb-4">
              <SearchBox
                placeholder="과목명 교수명 검색"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onDelete={() => setSearchInput('')}
              />
              <DepartmentFilter
                className="flex-auto"
                value={selectedDepartment}
                onChange={e => setSelectedDepartment(e.target.value)}
              />
            </div>

            {/* Search Results */}
            <SubjectCards
              className="flex flex-full overflow-auto max-h-screen"
              subjects={filteredData}
              isPending={isPending}
            />
          </div>
        </div>
      </CSSTransition>
    </>
  );
};

export default SearchSideBar;
