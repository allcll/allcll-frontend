import type { FormEvent } from 'react';
import useScheduleModal, { useScheduleModalData } from '@/features/timetable/lib/useScheduleModal.ts';
import { ScheduleMutateType } from '@/features/timetable/model/useScheduleState.ts';
import { Button, Flex } from '@allcll/allcll-ui';
import BottomSheet from '@/shared/ui/bottomsheet/BottomSheet';
import ScheduleFormContent from '@/features/timetable/ui/ScheduleFormContent';
import DeleteConfirmationActions from '@/features/timetable/ui/DeleteConfirmationActions';
import useDeleteConfirmation from '@/features/timetable/lib/useDeleteConfirmation';

function ScheduleFormBottomSheet({ isOpen }: { isOpen: boolean }) {
  const { modalActionType } = useScheduleModalData();
  const { cancelSchedule, deleteSchedule, saveSchedule } = useScheduleModal();

  const title = modalActionType === ScheduleMutateType.CREATE ? '생성' : '수정';
  const { isDeleteConfirming, requestDeleteConfirmation, cancelDeleteConfirmation, confirmDelete } =
    useDeleteConfirmation(deleteSchedule, isOpen);

  const handleSubmit = (e: FormEvent) => {
    saveSchedule(e);
  };

  return (
    <BottomSheet title={`커스텀 일정 ${title}`} isOpen={isOpen} onClose={() => cancelSchedule()}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Flex direction="column">
          <ScheduleFormContent />
        </Flex>

        <BottomSheet.Footer>
          {isDeleteConfirming ? (
            <DeleteConfirmationActions
              message="커스텀 일정을 삭제하시겠습니까?"
              size="medium"
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
                  size="medium"
                  className="mr-auto"
                  onClick={requestDeleteConfirmation}
                >
                  삭제
                </Button>
              )}

              <Button type="submit" variant="solid" size="medium">
                저장
              </Button>
            </>
          )}
        </BottomSheet.Footer>
      </form>
    </BottomSheet>
  );
}

export default ScheduleFormBottomSheet;
