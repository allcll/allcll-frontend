import { useDeferredValue, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { CloseIcon, Flex, Heading, IconButton } from '@allcll/allcll-ui';
import { initialFilters } from '@/features/filtering/model/useFilterStore.ts';
import useWishes from '@/entities/wishes/model/useWishes';
import SearchBox from '@/features/filtering/ui/SearchBox';
import useSearchRank from '@/features/filtering/lib/useSearchRank';
import useFilteringSubjects from '@/features/filtering/lib/useFilteringSubjects';
import DepartmentSelect from '@/entities/departments/ui/DepartmentSelect';
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
      <Flex
        direction="column"
        className="sticky top-14 self-start h-[calc(100dvh-3.5rem)] w-92 shrink-0 bg-gray-50 shadow-lg z-content"
      >
        <div className="flex justify-between items-center px-4 h-14 shrink-0 bg-white border-b border-gray-100">
          <Heading level={3}>알림 과목 등록</Heading>
          <IconButton
            size="medium"
            className="p-2 hover:bg-gray-100 active:bg-gray-100"
            label="알림 과목 등록 닫기"
            icon={<CloseIcon className="text-gray-500" />}
            onClick={onClose}
          />
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
    <Flex direction="column" className="flex-1 min-h-0 p-2">
      <Flex direction="column" className="flex-1 min-h-0" gap={2}>
        <SearchBox
          placeholder="과목명, 교수명, 학수번호 검색"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onDelete={() => setSearchInput('')}
          className="w-full"
        />
        <DepartmentSelect value={selectedDepartment} onChange={code => setSelectedDepartment(code)} />
        <PinCards className="flex-1 min-h-0 overflow-y-auto" subjects={filteredData} isPending={isPending} />
      </Flex>
    </Flex>
  );
}

export default PinSearchSideBar;
