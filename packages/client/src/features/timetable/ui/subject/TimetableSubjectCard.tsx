import React from 'react';
import { Button, Badge, Flex, Heading } from '@allcll/allcll-ui';
import useScheduleModal from '@/features/timetable/lib/useScheduleModal.ts';
import useSearchLogging from '@/features/filtering/lib/useSearchLogging.ts';
import { loggingDepartment } from '@/features/filtering/lib/useSearchRank.ts';
import { Wishes } from '@/shared/model/types.ts';
import BasketBadge from '@/entities/wishes/ui/BasketBadge';

interface ISubjectCard {
  isActive?: boolean;
  subject: Wishes;
  onClick: () => void;
  forwardedRef?: React.Ref<HTMLButtonElement>;
}

function TimetableSubjectCard({ isActive, subject, onClick, forwardedRef }: Readonly<ISubjectCard>) {
  const color = isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-700 bg-white hover:bg-gray-50';
  const { saveSchedule } = useScheduleModal();
  const { selectTargetOnly } = useSearchLogging();

  const handleAddOfficialSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    saveSchedule(e, false);
    selectTargetOnly(subject.subjectId);
    loggingDepartment(subject.deptCd);
  };

  return (
    <button
      type="button"
      className={`border border-gray-200 rounded-lg p-3 sm:p-4 gap-2 sm:gap-3 ${color} cursor-pointer w-full text-left`}
      onClick={onClick}
      ref={forwardedRef}
    >
      <Flex direction="flex-col">
        <Flex justify="justify-between" align="items-center" gap="gap-2 ">
          <Heading level={3}>{subject.subjectName}</Heading>
          <span className="text-xs sm:text-sm text-gray-500">{subject.professorName}</span>
        </Flex>

        <Flex direction="flex-col" justify="justify-start" align="items-start" gap="gap-2 ">
          <span className="text-xs sm:text-sm text-gray-500">{subject.lesnTime}</span>
          <span className="text-xs sm:text-sm text-gray-500">{subject.lesnRoom}</span>
          <span className="text-xs sm:text-sm text-gray-500">
            {subject.studentYear}학년/{subject.manageDeptNm}
          </span>
        </Flex>

        <Flex justify="justify-between" align="items-center">
          <Badge variant="default">{subject.tmNum[0]}학점</Badge>
          {!isActive && subject.totalCount !== -1 && (
            <BasketBadge wishCount={subject.totalCount ?? -1} formatter={value => `관심: ${value}명`} />
          )}
          {isActive && (
            <Button variant="primary" size="medium" onClick={handleAddOfficialSchedule}>
              추가하기
            </Button>
          )}
        </Flex>
      </Flex>
    </button>
  );
}

export default TimetableSubjectCard;
