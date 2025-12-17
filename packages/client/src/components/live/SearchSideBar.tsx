import React, { useDeferredValue, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import SearchBox from '@/shared/ui/SearchBox';
import DepartmentFilter from '@/components/live/DepartmentFilter.tsx';
import SubjectCards from '@/components/live/subjectTable/SubjectCards.tsx';
import { initialFilters } from '@/store/useFilterStore.ts';
import useSearchRank from '@/hooks/useSearchRank.ts';
import useFilteringSubjects from '@/hooks/useFilteringSubjects.ts';
import useWishes from '@/hooks/server/useWishes.ts';
import XSvg from '@/assets/x.svg?react';
import { Flex, Heading, IconButton } from '@allcll/allcll-ui';

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
    useFilteringSubjects(data ?? [], {
      ...initialFilters,
      keywords: searchInput,
      department: selectedDepartment,
    }),
  );

  return (
    <CSSTransition in={isOpen} timeout={100} classNames={transitionClasses} unmountOnExit>
      <Flex direction="flex-col" className="w-92 flex-auto bg-gray-50 shadow-lg z-10">
        <div className="flex justify-between items-center py-2 pl-4 pr-2 bg-white border-b border-gray-200">
          <Heading level={2}>알림 설정</Heading>
          <IconButton aria-label="알림 설정 닫기" icon={<XSvg className="w-4 h-4" />} onClick={onClose} />
        </div>

        <Flex direction="flex-col" className="flex-1 p-4">
          <Flex direction="flex-col" className="mb-4" gap="gap-2">
            <SearchBox
              placeholder="과목명 교수명 검색"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onDelete={() => setSearchInput('')}
              className="w-full"
            />
            <DepartmentFilter
              className="flex-auto"
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
            />
          </Flex>

          <SubjectCards
            className="flex flex-full overflow-auto max-h-screen"
            subjects={filteredData}
            isPending={isPending}
          />
        </Flex>
      </Flex>
    </CSSTransition>
  );
};

export default SearchSideBar;
