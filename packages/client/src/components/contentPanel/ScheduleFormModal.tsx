import { useEffect } from 'react';
import ScheduleFormContent from './ScheduleFormContent';
import useScheduleModal, { useScheduleModalData } from '@/hooks/useScheduleModal.ts';
import { ScheduleMutateType } from '@/store/useScheduleState.ts';
import { Button, Dialog } from '@allcll/allcll-ui';
import useMobile from '@/hooks/useMobile';

function ScheduleFormModal() {
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
    deleteSchedule(e);
  };

  return (
    <Dialog title={`커스텀 일정 ${title}`} onClose={cancelSchedule} isOpen={true}>
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
  );
}

export default ScheduleFormModal;
