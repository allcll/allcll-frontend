import { useBottomSheetStore } from '@/store/useBottomSheetStore.ts';
import { useScheduleState } from '@/store/useScheduleState.ts';
import { saveImageFromElement } from '@/shared/lib/saveImage.ts';
import { Button, Flex, IconButton } from '../../../../allcll-ui';
import DropdownSelect from './DropdownSelect.tsx';
import SearchSvg from '@/assets/search.svg?react';
import DownloadSvg from '@/assets/download.svg?react';
import EditTimetable from '../../components/contentPanel/EditTimetable.tsx';
import { useState } from 'react';

type modalType = 'edit' | 'create' | null;

function TimetableHeader() {
  const [isOpenModal, setIsOpenModal] = useState<modalType>(null);

  const handleCreateTimetable = () => {
    setIsOpenModal('create');
  };

  return (
    <header>
      <Flex align="items-center" justify="justify-between" gap="gap-2">
        <DropdownSelect setIsOpenModal={setIsOpenModal} openCreateModal={handleCreateTimetable} />
        <TimetableHeaderActions setIsOpenModal={setIsOpenModal} />
        {isOpenModal && <EditTimetable type={isOpenModal} onClose={() => setIsOpenModal(null)} />}
      </Flex>
    </header>
  );
}

export default TimetableHeader;

function TimetableHeaderActions({
  setIsOpenModal,
}: {
  setIsOpenModal: React.Dispatch<React.SetStateAction<modalType>>;
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

      {!isMobile && (
        <Button variant="text" size="medium" onClick={handleCreateTimetable}>
          + 시간표 만들기
        </Button>
      )}
    </Flex>
  );
}
