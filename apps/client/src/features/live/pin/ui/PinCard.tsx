import AlarmButton from '@/features/live/pin/ui/AlarmButton';
import { getTimeDiffString, joinPresent } from '@/shared/lib/stringFormats.ts';
import { Subject, Wishes } from '@/shared/model/types.ts';
import { getSeatColor } from '@/shared/config/colors.ts';
import { Badge, Card, Flex, Heading } from '@allcll/allcll-ui';
import { parseCredit } from '@/shared/lib/parser.ts';

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

  const credit = parseCredit(subject.tmNum);

  return (
    <Card variant="elevated">
      <Flex justify="between">
        <Heading level={3}>{subject.subjectName}</Heading>
        <AlarmButton subject={subject} variant="plain" />
      </Flex>

      <Flex className="text-xs text-fg-muted" direction="column">
        <p>{(subject as Wishes).departmentName}</p>
        <p>{joinPresent([`${subject.subjectCode}-${subject.classCode}`, subject.professorName])}</p>
      </Flex>

      <p className="text-xs text-fg-muted mb-2">
        {joinPresent([
          subject.studentYear && `${subject.studentYear}학년`,
          subject.curiTypeCdNm,
          credit && `${credit}학점`,
          subject.lesnTime,
        ])}
      </p>

      {!disableSeat && (
        <Flex gap={2} align="baseline" justify="between">
          <p className={`text-sm px-2 py-1 rounded-full font-bold ${getSeatColor(seats)}`}>
            여석: {seats < 0 ? '???' : seats}
          </p>
          {!isLive && <Badge color="gray">{getTimeDiffString(queryTime)}</Badge>}
          {isDeleted && <Badge color="danger">폐강</Badge>}
          {isEng && <Badge color="success">영어</Badge>}
        </Flex>
      )}
    </Card>
  );
}

export default PinCard;
