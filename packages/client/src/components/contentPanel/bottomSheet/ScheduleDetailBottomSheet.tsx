import React from 'react';
import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import ClockGraySvg from '@/assets/clock-gray.svg?react';
import HouseSvg from '@/assets/house.svg?react';
import useSubject from '@/hooks/server/useSubject';
import useScheduleModal, { useScheduleModalData } from '@/hooks/useScheduleModal.ts';
import { Button, Flex, Heading } from '@allcll/allcll-ui';

function ScheduleInfoBottomSheet() {
  const { schedule } = useScheduleModalData();
  const { deleteSchedule, cancelSchedule } = useScheduleModal();
  const { data: subjects } = useSubject();

  const handleDeleteOfficialSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    const confirmed = confirm('해당 과목을 삭제하시겠습니까?');
    if (!confirmed) return;

    deleteSchedule(e);
  };

  const findSubjectById = subjects?.find(subject => subject.subjectId === schedule.subjectId);

  return (
    <BottomSheet>
      <BottomSheetHeader headerType="close" onClose={cancelSchedule} />
      <Flex direction="flex-col" className="px-2 py-3 w-full text-sm text-gray-500 gap-2">
        <Heading level={3}>{schedule.subjectName}</Heading>
        <p className="text-sm text-gray-500">{schedule.professorName ?? '교수 정보 없음'}</p>

        <Flex align="items-center">
          <ClockGraySvg className="w-4 h-4 text-gray-400" />
          <span>{findSubjectById?.lesnTime}</span>
        </Flex>

        <Flex align="items-center">
          <HouseSvg className="w-4 h-4 text-gray-400" />
          <span>{findSubjectById?.lesnRoom ?? '장소 정보 없음'}</span>
        </Flex>

        <Flex>
          <span>{findSubjectById?.manageDeptNm}</span>
          <span> {findSubjectById?.studentYear + '학년'}</span>
          <span className="text-blue-500 text-sm">{findSubjectById?.tmNum[0] + '학점'}</span>
        </Flex>

        <Flex>
          <span>{findSubjectById?.curiTypeCdNm ?? ''} </span>
          <span>{findSubjectById?.remark ?? ''}</span>
        </Flex>

        <Flex justify="justify-end" className="px-2">
          <Button variant="text" size="medium" textColor="secondary" onClick={handleDeleteOfficialSchedule}>
            삭제
          </Button>
        </Flex>
      </Flex>
    </BottomSheet>
  );
}

export default ScheduleInfoBottomSheet;
