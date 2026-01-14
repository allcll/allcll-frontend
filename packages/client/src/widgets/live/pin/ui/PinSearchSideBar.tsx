import { useDeferredValue, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import XSvg from '@/assets/x.svg?react';
import { Flex, Heading, IconButton } from '@allcll/allcll-ui';
import { initialFilters } from '@/features/filtering/model/useFilterStore.ts';
import useWishes from '@/entities/wishes/model/useWishes';
import SearchBox from '@/features/filtering/ui/SearchBox';
import useSearchRank from '@/features/filtering/lib/useSearchRank';
import useFilteringSubjects from '@/features/filtering/lib/useFilteringSubjects';
import DepartmentFilter from '@/entities/departments/ui/DepartmentSelect';
import PinCards from './PinCards';

interface PinSearchSideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const transitionClasses = {
  enter: 'sidebar-transition-enter',
  enterActive: 'sidebar-transition-enter-active',
  exit: 'sidebar-transition-exit',
  exitActive: 'sidebar-transition-exit-active',
};

function PinSearchSideBar({ isOpen, onClose }: PinSearchSideBarProps) {
  return (
    <CSSTransition in={isOpen} timeout={100} classNames={transitionClasses} unmountOnExit>
      <Flex direction="flex-col" className="w-92 flex-auto bg-gray-50 shadow-lg z-10">
        <div className="flex justify-between items-center py-2 pl-4 pr-2 bg-white border-b border-gray-200">
          <Heading level={2}>알림 설정</Heading>
          <IconButton aria-label="알림 설정 닫기" icon={<XSvg className="w-4 h-4" />} onClick={onClose} />
        </div>
        <PinSearch />
      </Flex>
    </CSSTransition>
  );
}

function PinSearch() {
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
    <Flex direction="flex-col" className="flex-1 p-2">
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
        <PinCards className="flex flex-full overflow-auto max-h-screen" subjects={filteredData} isPending={isPending} />
      </Flex>
    </Flex>
  );
}

export default PinSearchSideBar;
