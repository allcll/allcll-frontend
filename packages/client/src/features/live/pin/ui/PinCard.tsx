import AlarmButton from '@/features/live/pin/ui/AlarmButton';
import { getTimeDiffString } from '@/shared/lib/stringFormats.ts';
import { Subject, Wishes } from '@/utils/types.ts';
import { getSeatColor } from '@/shared/config/colors.ts';
import { Card, Flex, Heading } from '@allcll/allcll-ui';

interface IPinCard {
  subject: Subject | Wishes;
  seats: number;
  queryTime?: string;
  disableSeat?: boolean;
  className?: string;
  isLive?: boolean;
}

function PinCard({ subject, seats, queryTime, disableSeat = false, isLive = false }: Readonly<IPinCard>) {
  const isDeleted = subject.isDeleted;
  const isEng = subject.curiLangNm === '영어';

  const credit = typeof subject.tmNum === 'string' ? Number(subject.tmNum.split('/')[0]) || 0 : 0;

  return (
    <Card variant="elevated">
      <Flex justify="justify-between">
        <Heading level={3}>{subject.subjectName}</Heading>
        <AlarmButton subject={subject} variant="plain" />
      </Flex>

      <Flex className="text-xs text-gray-500" direction="flex-col">
        <p>{(subject as Wishes).departmentName}</p>
        <p>
          {subject.subjectCode}-{subject.classCode} | {subject.professorName}
        </p>
      </Flex>

      <p className="text-xs text-gray-500 mb-2">
        {subject.studentYear}학년 {subject.curiTypeCdNm} | {credit}학점 | {subject.lesnTime}
      </p>

      {!disableSeat && (
        <Flex gap="gap-2" align="items-baseline" justify="justify-between">
          <p className={`text-sm px-2 py-1 rounded-full font-bold ${getSeatColor(seats)}`}>
            여석: {seats < 0 ? '???' : seats}
          </p>
          {!isLive && <p className={`text-xs text-gray-500`}>{getTimeDiffString(queryTime)}</p>}
          {isDeleted && <p className={`text-xs text-gray-500`}>폐강</p>}
          {isEng && <p className={`text-xs text-gray-500`}>영어</p>}
        </Flex>
      )}
    </Card>
  );
}

export default PinCard;
