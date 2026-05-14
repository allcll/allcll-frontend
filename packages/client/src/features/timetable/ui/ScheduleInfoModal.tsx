import { useState } from 'react';
import useScheduleModal, { useScheduleModalData } from '@/features/timetable/lib/useScheduleModal.ts';
import ClockGraySvg from '@/assets/clock-gray.svg?react';
import HouseSvg from '@/assets/house.svg?react';
import useSubject from '@/entities/subjects/model/useSubject.ts';
import { Button, Dialog, Flex } from '@allcll/allcll-ui';
import { useBottomSheetStore } from '@/shared/model/useBottomSheetStore.ts';
import { useSemesterParam } from '@/entities/semester/model/useSemesterParam';
import ConfirmDialog from '@/shared/ui/ConfirmDialog.tsx';

function ScheduleInfoModal() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const semester = useSemesterParam();

  const { schedule } = useScheduleModalData();
  const { deleteSchedule } = useScheduleModal();
  const closeBottomSheet = useBottomSheetStore(state => state.closeBottomSheet);
  const { data: subjects } = useSubject(semester);

  const handleDeleteOfficialSchedule = () => {
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteOpen(false);
    requestAnimationFrame(() => deleteSchedule());
  };

  const findSubjectById = subjects?.find(subject => subject.subjectId === schedule.subjectId);

  return (
    <>
      <Dialog title={schedule.subjectName} onClose={() => closeBottomSheet('info')} isOpen={true}>
        <Dialog.Content>
          <Flex direction="flex-col" gap="gap-1" className="w-80 text-sm text-gray-500">
            <p>{schedule.professorName ?? '교수 정보 없음'}</p>

            <Flex align="items-center" gap="gap-2">
              <ClockGraySvg className="w-4 h-4 text-gray-400" />
              <p>{findSubjectById?.lesnTime}</p>
            </Flex>

            <Flex align="items-center" gap="gap-2">
              <HouseSvg className="w-4 h-4 text-gray-400" />
              <p>{findSubjectById?.lesnRoom ?? '장소 정보 없음'}</p>
            </Flex>
            <p>
              {findSubjectById?.manageDeptNm} {findSubjectById?.studentYear + '학년'}{' '}
              <span className="text-blue-500">{findSubjectById?.tmNum[0] + '학점'}</span>
            </p>
          </Flex>
        </Dialog.Content>

        <Dialog.Footer>
          <Button variant="text" size="medium" textColor="secondary" onClick={handleDeleteOfficialSchedule}>
            삭제
          </Button>
        </Dialog.Footer>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="과목 삭제"
        description="해당 과목을 삭제하시겠습니까?"
        confirmLabel="삭제"
        danger
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteOpen(false)}
      />
    </>
  );
}

export default ScheduleInfoModal;
