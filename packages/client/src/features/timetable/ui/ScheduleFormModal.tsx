import { useEffect, useState } from 'react';
import ScheduleFormContent from './ScheduleFormContent.tsx';
import useScheduleModal, { useScheduleModalData } from '@/features/timetable/lib/useScheduleModal.ts';
import { ScheduleMutateType } from '@/features/timetable/model/useScheduleState.ts';
import { Button, Dialog } from '@allcll/allcll-ui';
import useMobile from '@/shared/lib/useMobile.ts';
import ConfirmDialog from '@/shared/ui/ConfirmDialog.tsx';

function ScheduleFormModal() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { modalActionType } = useScheduleModalData();
  const title = modalActionType === ScheduleMutateType.CREATE ? '생성' : '수정';
  const { saveSchedule, deleteSchedule, cancelSchedule } = useScheduleModal();
  const isMobile = useMobile();

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') cancelSchedule(e);
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    saveSchedule(e);
  };

  const handleDeleteSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteOpen(false);
    requestAnimationFrame(() => deleteSchedule());
  };

  return (
    <>
      <Dialog title={`커스텀 과목 ${title}`} onClose={cancelSchedule} isOpen={true}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Dialog.Content>
            <ScheduleFormContent />
          </Dialog.Content>

          <Dialog.Footer>
            {(modalActionType === ScheduleMutateType.EDIT || modalActionType === ScheduleMutateType.VIEW) && (
              <Button variant="secondary" size={isMobile ? 'small' : 'medium'} onClick={handleDeleteSchedule}>
                삭제
              </Button>
            )}

            <Button type="submit" variant="primary" size={isMobile ? 'small' : 'medium'}>
              저장
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="커스텀 과목 삭제"
        description="해당 커스텀 과목을 삭제하시겠습니까?"
        confirmLabel="삭제"
        danger
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteOpen(false)}
      />
    </>
  );
}

export default ScheduleFormModal;
