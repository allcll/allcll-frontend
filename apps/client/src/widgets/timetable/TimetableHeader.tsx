import { useScheduleState } from '@/features/timetable/model/useScheduleState.ts';
import { saveImageFromElement } from '@/shared/lib/saveImage.ts';
import { AddIcon, Button, Flex, IconButton, DownloadIcon } from '@allcll/allcll-ui';

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
        size="large"
        icon={<DownloadIcon className="text-fg-subtle" />}
        variant="plain"
        label="시간표 이미지 저장"
        onClick={handleSaveImage}
      />

      {!isMobile && timetables && timetables.length >= 0 && (
        <Button variant="text" size="medium" onClick={handleCreateTimetable}>
          <AddIcon />
          시간표 만들기
        </Button>
      )}
    </Flex>
  );
}
