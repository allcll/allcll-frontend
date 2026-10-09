import { useEffect } from 'react';
import ScheduleFormContent from './ScheduleFormContent.tsx';
import useScheduleModal, { useScheduleModalData } from '@/features/timetable/lib/useScheduleModal.ts';
import { ScheduleMutateType } from '@/features/timetable/model/useScheduleState.ts';
import { Button, Dialog } from '@allcll/allcll-ui';
import useMobile from '@/shared/lib/useMobile.ts';
import DeleteConfirmationActions from '@/features/timetable/ui/DeleteConfirmationActions.tsx';
import useDeleteConfirmation from '@/features/timetable/lib/useDeleteConfirmation.ts';

function ScheduleFormModal() {
  const { modalActionType } = useScheduleModalData();
  const title = modalActionType === ScheduleMutateType.CREATE ? '생성' : '수정';
  const { saveSchedule, deleteSchedule, cancelSchedule } = useScheduleModal();
  const isMobile = useMobile();
  const buttonSize = isMobile ? 'small' : 'medium';
  const { isDeleteConfirming, requestDeleteConfirmation, cancelDeleteConfirmation, confirmDelete } =
    useDeleteConfirmation(deleteSchedule);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cancelSchedule(e);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [cancelSchedule]);

  const handleSubmit = (e: React.FormEvent) => {
    saveSchedule(e);
  };

  return (
    <Dialog title={`커스텀 일정 ${title}`} onClose={cancelSchedule} isOpen={true}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Dialog.Content>
          <ScheduleFormContent />
        </Dialog.Content>

        <Dialog.Footer>
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
                <Button type="button" variant="secondary" size={buttonSize} onClick={requestDeleteConfirmation}>
                  삭제
                </Button>
              )}

              <Button type="submit" variant="primary" size={buttonSize}>
                저장
              </Button>
            </>
          )}
        </Dialog.Footer>
      </form>
    </Dialog>
  );
}

export default ScheduleFormModal;
