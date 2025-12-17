import React from 'react';
import BottomSheet from '../../shared/ui/bottomsheet/BottomSheet.tsx';
import BottomSheetHeader from '../../shared/ui/bottomsheet/BottomSheetHeader.tsx';
import ScheduleFormContent from '../../components/contentPanel/ScheduleFormContent.tsx';
import useScheduleModal, { useScheduleModalData } from '@/hooks/useScheduleModal.ts';
import { ScheduleMutateType } from '@/store/useScheduleState.ts';
import { Button, Flex } from '@allcll/allcll-ui';
import useMobile from '@/shared/lib/useMobile.ts';

function FormBottomSheet() {
  const { modalActionType } = useScheduleModalData();
  const { cancelSchedule, deleteSchedule } = useScheduleModal();

  const handleCancelSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    cancelSchedule(e);
  };

  const title = modalActionType === ScheduleMutateType.CREATE ? '생성' : '수정';
  const isMobile = useMobile();

  return (
    <BottomSheet>
      <BottomSheetHeader title={`커스텀 일정 ${title}`} headerType="close" onClose={handleCancelSchedule} />
      <Flex direction="flex-col" className="py-5 px-2 overflow-y-auto max-h-[80vh]">
        <ScheduleFormContent />
      </Flex>

      {(modalActionType === ScheduleMutateType.EDIT || modalActionType === ScheduleMutateType.VIEW) && (
        <Button variant="secondary" size={isMobile ? 'small' : 'medium'} onClick={deleteSchedule}>
          삭제
        </Button>
      )}

      <Button type="submit" variant="primary" size={isMobile ? 'small' : 'medium'}>
        저장
      </Button>
    </BottomSheet>
  );
}

export default FormBottomSheet;
