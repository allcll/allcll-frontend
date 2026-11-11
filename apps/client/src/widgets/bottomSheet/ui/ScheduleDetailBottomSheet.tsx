import { HomeIcon, TimeIcon, Button, Flex } from '@allcll/allcll-ui';
import useSubject from '@/entities/subjects/model/useSubject.ts';
import useScheduleModal, { useScheduleModalData } from '@/features/timetable/lib/useScheduleModal.ts';
import BottomSheet from '@/shared/ui/bottomsheet/BottomSheet';
import { useOverlayStore } from '@/shared/model/useOverlayStore.ts';
import { useSemesterParam } from '@/entities/semester/model/useSemesterParam';
import DeleteConfirmationActions from '@/features/timetable/ui/DeleteConfirmationActions';
import useDeleteConfirmation from '@/features/timetable/lib/useDeleteConfirmation';
import { parseCredit } from '@/shared/lib/parser.ts';

function ScheduleInfoBottomSheet({ isOpen }: { isOpen: boolean }) {
  const semester = useSemesterParam();

  const { schedule } = useScheduleModalData();
  const { deleteSchedule, cancelSchedule } = useScheduleModal();
  const closeOverlay = useOverlayStore(state => state.closeOverlay);
  const { data: subjects } = useSubject(semester);
  const { isDeleteConfirming, requestDeleteConfirmation, cancelDeleteConfirmation, confirmDelete } =
    useDeleteConfirmation(deleteSchedule, isOpen);

  const findSubjectById = subjects?.find(subject => subject.subjectId === schedule.subjectId);

  const handleClose = () => {
    cancelSchedule(undefined, false);
    closeOverlay('info');
  };

  return (
    <BottomSheet title={schedule.subjectName} isOpen={isOpen} onClose={handleClose}>
      <Flex direction="column" gap={6}>
        <Flex direction="column" className="w-full text-sm text-gray-500">
          <p className="text-sm text-gray-500">{schedule.professorName ?? '교수 정보 없음'}</p>

          <Flex align="center">
            <TimeIcon className="w-4 h-4 text-gray-400" />
            <span>{findSubjectById?.lesnTime}</span>
          </Flex>

          <Flex align="center">
            <HomeIcon className="w-4 h-4 text-gray-400" />
            <span>{findSubjectById?.lesnRoom ?? '장소 정보 없음'}</span>
          </Flex>

          <Flex>
            <span>{findSubjectById?.manageDeptNm}</span>
            <span> {findSubjectById?.studentYear + '학년'}</span>
            <span className="text-primary-500 text-sm">{parseCredit(findSubjectById?.tmNum) + '학점'}</span>
          </Flex>

          <Flex>
            <span>{findSubjectById?.curiTypeCdNm ?? ''} </span>
            <span>{findSubjectById?.remark ?? ''}</span>
          </Flex>
        </Flex>

        <BottomSheet.Footer>
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
        </BottomSheet.Footer>
      </Flex>
    </BottomSheet>
  );
}

export default ScheduleInfoBottomSheet;
