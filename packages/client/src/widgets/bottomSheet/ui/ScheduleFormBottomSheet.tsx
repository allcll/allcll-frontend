import React, { useState } from 'react';
import useScheduleModal, { useScheduleModalData } from '@/features/timetable/lib/useScheduleModal.ts';
import { ScheduleMutateType } from '@/features/timetable/model/useScheduleState.ts';
import { Button, Flex } from '@allcll/allcll-ui';
import useMobile from '@/shared/lib/useMobile.ts';
import BottomSheet from '@/shared/ui/bottomsheet/BottomSheet';
import BottomSheetHeader from '@/shared/ui/bottomsheet/BottomSheetHeader';
import ScheduleFormContent from '@/features/timetable/ui/ScheduleFormContent';

function ScheduleFormBottomSheet() {
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
  const { modalActionType } = useScheduleModalData();
  const { cancelSchedule, deleteSchedule, saveSchedule } = useScheduleModal();

  const handleCancelSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    cancelSchedule(e);
  };

  const title = modalActionType === ScheduleMutateType.CREATE ? '생성' : '수정';
  const isMobile = useMobile();

  const handleSubmit = (e: React.FormEvent) => {
    saveSchedule(e);
  };

  const handleDeleteSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDeleteConfirming(true);
  };

  const handleCancelDeleteConfirmation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteConfirming(false);
  };

  const handleConfirmDelete = () => {
    deleteSchedule();
  };

  return (
    <BottomSheet>
      <BottomSheetHeader title={`커스텀 일정 ${title}`} headerType="close" onClose={handleCancelSchedule} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Flex direction="flex-col" className="py-5 px-2 overflow-y-auto max-h-[80vh]">
          <ScheduleFormContent />
        </Flex>

        <Flex justify="justify-end" align="items-center" gap={isMobile ? 'gap-2' : 'gap-4'} className="p-4">
          {isDeleteConfirming ? (
            <>
              <span className="self-center text-sm text-gray-600">커스텀 일정을 삭제하시겠습니까?</span>
              <Button
                type="button"
                variant="secondary"
                size={isMobile ? 'small' : 'medium'}
                onClick={handleCancelDeleteConfirmation}
              >
                취소
              </Button>
              <Button type="button" variant="danger" size={isMobile ? 'small' : 'medium'} onClick={handleConfirmDelete}>
                삭제
              </Button>
            </>
          ) : (
            <>
              {(modalActionType === ScheduleMutateType.EDIT || modalActionType === ScheduleMutateType.VIEW) && (
                <Button
                  type="button"
                  variant="secondary"
                  size={isMobile ? 'small' : 'medium'}
                  onClick={handleDeleteSchedule}
                >
                  삭제
                </Button>
              )}

              <Button type="submit" variant="primary" size={isMobile ? 'small' : 'medium'}>
                저장
              </Button>
            </>
          )}
        </Flex>
      </form>
    </BottomSheet>
  );
}

export default ScheduleFormBottomSheet;
