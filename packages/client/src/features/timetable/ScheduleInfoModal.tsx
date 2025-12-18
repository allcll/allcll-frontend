import useScheduleModal, { useScheduleModalData } from '@/hooks/useScheduleModal.ts';
import ClockGraySvg from '@/assets/clock-gray.svg?react';
import HouseSvg from '@/assets/house.svg?react';
import useSubject from '@/entities/subjects/api/useSubject.ts';
import React from 'react';
import { Button, Dialog, Flex } from '../../../../allcll-ui';
import { useBottomSheetStore } from '@/store/useBottomSheetStore.ts';

function ScheduleInfoModal() {
  const { schedule } = useScheduleModalData();
  const { deleteSchedule } = useScheduleModal();
  const closeBottomSheet = useBottomSheetStore(state => state.closeBottomSheet);
  const { data: subjects } = useSubject();

  const handleDeleteOfficialSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    const confirmed = confirm('해당 과목을 삭제하시겠습니까?');
    if (!confirmed) return;

    deleteSchedule(e);
  };

  const findSubjectById = subjects?.find(subject => subject.subjectId === schedule.subjectId);

  return (
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
  );
}

export default ScheduleInfoModal;
