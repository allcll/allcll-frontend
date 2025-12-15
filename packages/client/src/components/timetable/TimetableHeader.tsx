import { TimetableType, useTimetables } from '@/hooks/server/useTimetableSchedules';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { useScheduleState } from '@/store/useScheduleState';
import { saveImageFromElement } from '@/utils/saveImage';
import { Button, Flex, IconButton } from '@allcll/allcll-ui';
import DropdownSelect from './DropdownSelect';
import SearchSvg from '@/assets/search.svg?react';
import DownloadSvg from '@/assets/download.svg?react';
import { useSearchParams } from 'react-router-dom';

type modalType = 'edit' | 'create' | null;

interface ITimetableHeaderProps {
  setIsOpenModal: React.Dispatch<React.SetStateAction<modalType>>;
}

function TimetableHeader({ setIsOpenModal }: ITimetableHeaderProps) {
  const [searchParams] = useSearchParams();
  const semester = searchParams.get('semester');

  const { data: timetables = [] } = useTimetables();
  const filteredTimetablesBySemester = timetables.filter((timetable: TimetableType) => timetable.semester === semester);
  const setCurrentTimetable = useScheduleState(state => state.pickTimetable);

  const handleSelect = (optionId: number) => {
    const selectedTimetable = timetables.find((timetable: TimetableType) => timetable.timeTableId === optionId);

    if (selectedTimetable) {
      setCurrentTimetable(selectedTimetable);
    }
  };

  const handleCreateTimetable = () => {
    setIsOpenModal('create');
  };

  return (
    <header>
      <Flex align="items-center" justify="justify-between" gap="gap-2">
        <DropdownSelect
          onSelect={handleSelect}
          timetables={filteredTimetablesBySemester}
          setIsOpenModal={setIsOpenModal}
          openCreateModal={handleCreateTimetable}
        />

        <TimetableHeaderActions setIsOpenModal={setIsOpenModal} />
      </Flex>
    </header>
  );
}

export default TimetableHeader;

function TimetableHeaderActions({ setIsOpenModal }: ITimetableHeaderProps) {
  const isMobile = useScheduleState(state => state.options.isMobile);
  const openBottomSheet = useBottomSheetStore(state => state.openBottomSheet);

  const handleSaveImage = () => {
    const name = useScheduleState.getState()?.currentTimetable?.timeTableName;
    const containerRef = useScheduleState.getState().options.containerRef;
    saveImageFromElement(containerRef, name ? name + '.png' : '시간표.png');
  };

  const handleCreateTimetable = () => {
    setIsOpenModal('create');
  };

  return (
    <Flex>
      <Button variant="text" size="medium" onClick={handleCreateTimetable}>
        + 시간표 만들기
      </Button>
      <IconButton
        icon={<DownloadSvg className="w-5 h-5" />}
        variant="plain"
        label="시간표 이미지 저장"
        onClick={handleSaveImage}
      />

      {isMobile && (
        <IconButton
          icon={<SearchSvg className="w-5 h-5" />}
          variant="plain"
          label="과목 검색"
          onClick={() => openBottomSheet('search')}
        />
      )}
    </Flex>
  );
}
