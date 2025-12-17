import React from 'react';
import BottomSheet from '../../shared/ui/bottomsheet/BottomSheet.tsx';
import BottomSheetHeader from '../../shared/ui/bottomsheet/BottomSheetHeader.tsx';
import ScheduleFormContent from '../../components/contentPanel/ScheduleFormContent.tsx';
import useScheduleModal, { useScheduleModalData } from '@/hooks/useScheduleModal.ts';
import { ScheduleMutateType } from '@/store/useScheduleState.ts';
import { Flex } from '../../../../allcll-ui';

function FormBottomSheet() {
  const { modalActionType } = useScheduleModalData();
  const { cancelSchedule } = useScheduleModal();

  const handleCancelSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    cancelSchedule(e);
  };

  const title = modalActionType === ScheduleMutateType.CREATE ? '생성' : '수정';

  return (
    <BottomSheet>
      <BottomSheetHeader title={`커스텀 일정 ${title}`} headerType="close" onClose={handleCancelSchedule} />
      <Flex direction="flex-col" className="py-5 px-2 overflow-y-auto max-h-[80vh]">
        <ScheduleFormContent />
      </Flex>
    </BottomSheet>
  );
}

export default FormBottomSheet;
