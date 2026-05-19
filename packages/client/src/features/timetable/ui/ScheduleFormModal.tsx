import { useEffect, useState } from 'react';
import ScheduleFormContent from './ScheduleFormContent.tsx';
import useScheduleModal, { useScheduleModalData } from '@/features/timetable/lib/useScheduleModal.ts';
import { ScheduleMutateType } from '@/features/timetable/model/useScheduleState.ts';
import { Button, Dialog } from '@allcll/allcll-ui';
import useMobile from '@/shared/lib/useMobile.ts';

function ScheduleFormModal() {
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
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
    <Dialog title={`커스텀 일정 ${title}`} onClose={cancelSchedule} isOpen={true}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Dialog.Content>
          <ScheduleFormContent />
        </Dialog.Content>

        <Dialog.Footer>
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
        </Dialog.Footer>
      </form>
    </Dialog>
  );
}

export default ScheduleFormModal;
