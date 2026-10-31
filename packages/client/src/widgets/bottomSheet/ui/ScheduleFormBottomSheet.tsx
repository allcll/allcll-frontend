import type { FormEvent } from 'react';
import useScheduleModal, { useScheduleModalData } from '@/features/timetable/lib/useScheduleModal.ts';
import { ScheduleMutateType } from '@/features/timetable/model/useScheduleState.ts';
import { Button, Flex } from '@allcll/allcll-ui';
import useMobile from '@/shared/lib/useMobile.ts';
import BottomSheet from '@/shared/ui/bottomsheet/BottomSheet';
import ScheduleFormContent from '@/features/timetable/ui/ScheduleFormContent';
import DeleteConfirmationActions from '@/features/timetable/ui/DeleteConfirmationActions';
import useDeleteConfirmation from '@/features/timetable/lib/useDeleteConfirmation';

function ScheduleFormBottomSheet() {
  const { modalActionType } = useScheduleModalData();
  const { cancelSchedule, deleteSchedule, saveSchedule } = useScheduleModal();

  const title = modalActionType === ScheduleMutateType.CREATE ? '생성' : '수정';
  const isMobile = useMobile();
  const buttonSize = isMobile ? 'small' : 'medium';
  const { isDeleteConfirming, requestDeleteConfirmation, cancelDeleteConfirmation, confirmDelete } =
    useDeleteConfirmation(deleteSchedule);

  const handleSubmit = (e: FormEvent) => {
    saveSchedule(e);
  };

  return (
    <BottomSheet title={`커스텀 일정 ${title}`} onClose={() => cancelSchedule()}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Flex direction="flex-col" className="py-5 px-4">
          <ScheduleFormContent />
        </Flex>

        <Flex justify="justify-end" align="items-center" gap={isMobile ? 'gap-2' : 'gap-4'} className="p-4">
          {isDeleteConfirming ? (
            <DeleteConfirmationActions
              message="커스텀 일정을 삭제하시겠습니까?"
              size={buttonSize}
              onCancel={cancelDeleteConfirmation}
              onConfirm={confirmDelete}
            />
          ) : (
            <>
              {(modalActionType === ScheduleMutateType.EDIT || modalActionType === ScheduleMutateType.VIEW) && (
                <Button
                  type="button"
                  variant="text"
                  color="danger"
                  size={buttonSize}
                  className="mr-auto"
                  onClick={requestDeleteConfirmation}
                >
                  삭제
                </Button>
              )}

              <Button type="submit" variant="solid" size={buttonSize}>
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
