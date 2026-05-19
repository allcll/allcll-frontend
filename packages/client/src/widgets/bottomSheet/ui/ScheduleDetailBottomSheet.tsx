import { useState } from 'react';
import ClockGraySvg from '@/assets/clock-gray.svg?react';
import HouseSvg from '@/assets/house.svg?react';
import useSubject from '@/entities/subjects/model/useSubject.ts';
import useScheduleModal, { useScheduleModalData } from '@/features/timetable/lib/useScheduleModal.ts';
import { Button, Flex, Heading } from '@allcll/allcll-ui';
import BottomSheet from '@/shared/ui/bottomsheet/BottomSheet';
import BottomSheetHeader from '@/shared/ui/bottomsheet/BottomSheetHeader';
import { useSemesterParam } from '@/entities/semester/model/useSemesterParam';

function ScheduleInfoBottomSheet() {
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
  const semester = useSemesterParam();

  const { schedule } = useScheduleModalData();
  const { deleteSchedule, cancelSchedule } = useScheduleModal();
  const { data: subjects } = useSubject(semester);

  const handleDeleteOfficialSchedule = () => {
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

        <Flex justify="justify-end" align="items-center" gap="gap-2" className="px-2">
          {isDeleteConfirming ? (
            <>
              <span className="self-center text-sm text-gray-600">과목을 삭제하시겠습니까?</span>
              <Button type="button" variant="secondary" size="medium" onClick={handleCancelDeleteConfirmation}>
                취소
              </Button>
              <Button type="button" variant="danger" size="medium" onClick={handleConfirmDelete}>
                삭제
              </Button>
            </>
          ) : (
            <Button variant="text" size="medium" textColor="secondary" onClick={handleDeleteOfficialSchedule}>
              삭제
            </Button>
          )}
        </Flex>
      </Flex>
    </BottomSheet>
  );
}

export default ScheduleInfoBottomSheet;
