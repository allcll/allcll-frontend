import useScheduleModal, { useScheduleModalData } from '@/features/timetable/lib/useScheduleModal.ts';
import { HomeIcon, TimeIcon, Button, Dialog, Flex } from '@allcll/allcll-ui';
import useSubject from '@/entities/subjects/model/useSubject.ts';
import { useOverlayStore } from '@/shared/model/useOverlayStore.ts';
import { useSemesterParam } from '@/entities/semester/model/useSemesterParam';
import DeleteConfirmationActions from '@/features/timetable/ui/DeleteConfirmationActions.tsx';
import useDeleteConfirmation from '@/features/timetable/lib/useDeleteConfirmation.ts';
import { parseCredit } from '@/shared/lib/parser.ts';

function ScheduleInfoModal() {
  const semester = useSemesterParam();

  const { schedule } = useScheduleModalData();
  const { deleteSchedule } = useScheduleModal();
  const closeOverlay = useOverlayStore(state => state.closeOverlay);
  const { data: subjects } = useSubject(semester);
  const { isDeleteConfirming, requestDeleteConfirmation, cancelDeleteConfirmation, confirmDelete } =
    useDeleteConfirmation(deleteSchedule);

  const findSubjectById = subjects?.find(subject => subject.subjectId === schedule.subjectId);

  return (
    <Dialog title={schedule.subjectName} onClose={() => closeOverlay('info')} isOpen={true}>
      <Dialog.Content>
        <Flex direction="flex-col" gap="gap-1" className="w-80 text-sm text-gray-500">
          <p>{schedule.professorName ?? '교수 정보 없음'}</p>

          <Flex align="items-center" gap="gap-2">
            <TimeIcon className="w-4 h-4 text-gray-400" />
            <p>{findSubjectById?.lesnTime}</p>
          </Flex>

          <Flex align="items-center" gap="gap-2">
            <HomeIcon className="w-4 h-4 text-gray-400" />
            <p>{findSubjectById?.lesnRoom ?? '장소 정보 없음'}</p>
          </Flex>
          <p>
            {findSubjectById?.manageDeptNm} {findSubjectById?.studentYear + '학년'}{' '}
            <span className="text-primary-500">{parseCredit(findSubjectById?.tmNum) + '학점'}</span>
          </p>
        </Flex>
      </Dialog.Content>

      <Dialog.Footer>
        {isDeleteConfirming ? (
          <DeleteConfirmationActions
            message="과목을 삭제하시겠습니까?"
            size="medium"
            onCancel={cancelDeleteConfirmation}
            onConfirm={confirmDelete}
          />
        ) : (
          <Button variant="text" size="medium" color="danger" onClick={requestDeleteConfirmation}>
            삭제
          </Button>
        )}
      </Dialog.Footer>
    </Dialog>
  );
}

export default ScheduleInfoModal;
