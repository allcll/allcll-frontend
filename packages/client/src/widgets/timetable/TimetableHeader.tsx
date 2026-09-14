import { useBottomSheetStore } from '@/shared/model/useBottomSheetStore.ts';
import { useScheduleState } from '@/features/timetable/model/useScheduleState.ts';
import { saveImageFromElement } from '@/shared/lib/saveImage.ts';
import { Button, Flex, IconButton } from '@allcll/allcll-ui';
import { DownloadIcon, SearchIcon } from '@allcll/allcll-ui';

import { TimetableType } from '@/entities/timetable/api/useTimetableSchedules.ts';

type modalType = 'edit' | 'create' | null;

export function TimetableHeaderActions({
  setIsOpenModal,
  timetables,
}: {
  setIsOpenModal: React.Dispatch<React.SetStateAction<modalType>>;
  timetables?: TimetableType[];
}) {
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
      <IconButton
        icon={<DownloadIcon className="w-5 h-5 text-gray-400" />}
        variant="plain"
        label="시간표 이미지 저장"
        onClick={handleSaveImage}
      />

      {isMobile && (
        <IconButton
          icon={<SearchIcon className="w-5 h-5 text-gray-400" />}
          variant="plain"
          label="과목 검색"
          onClick={() => openBottomSheet('search')}
        />
      )}

      {!isMobile && timetables && timetables.length >= 0 && (
        <Button variant="text" size="medium" onClick={handleCreateTimetable}>
          + 시간표 만들기
        </Button>
      )}
    </Flex>
  );
}
