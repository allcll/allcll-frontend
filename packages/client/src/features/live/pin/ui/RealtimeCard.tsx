import CloseIcon from '@/assets/x.svg?react';
import useTick from '@/features/live/board/lib/useTick.ts';
import { useRemovePinned } from '@/entities/subjects/model/capabilities/usePinned.ts';
import { getTimeDiffString } from '@/shared/lib/stringFormats.ts';
import { getSeatVariant } from '@/shared/config/colors.ts';
import { Subject, Wishes } from '@/shared/model/types.ts';
import { Badge, Card, Flex, Heading, IconButton } from '@allcll/allcll-ui';

interface IPinCard {
  subject: Subject | Wishes;
  seats: number;
  queryTime?: string;
  disableSeat?: boolean;
}

function RealtimeCard({ subject, seats, queryTime, disableSeat = false }: Readonly<IPinCard>) {
  const { mutate: deletePin } = useRemovePinned();

  const handlePin = () => {
    deletePin(subject.subjectId);
  };

  return (
    <Card variant="filled">
      <Flex justify="justify-between">
        <Heading level={3}>{subject.subjectName}</Heading>
        <IconButton
          variant="plain"
          aria-label="알림 과목 제거"
          icon={<CloseIcon className="text-gray-400 w-3 h-3" />}
          onClick={handlePin}
        />
      </Flex>
      <div className="mb-2 text-xs text-gray-500">
        <p>{(subject as Wishes).departmentName}</p>
        <p>
          {subject.subjectCode}-{subject.classCode} | {subject.professorName}
        </p>
      </div>
      {!disableSeat && (
        <Flex justify="justify-between">
          <SeatBadge seats={seats} />
          <QueryTimeComponent queryTime={queryTime} />
        </Flex>
      )}
    </Card>
  );
}

function QueryTimeComponent({ queryTime }: Readonly<{ queryTime?: string }>) {
  useTick();

  const text = getTimeDiffString(queryTime);
  const isLoading = text === '여석 확인 중';

  return <p className="text-xs text-gray-500">{isLoading ? text : `${text} 기준`}</p>;
}

function SeatBadge({ seats }: Readonly<{ seats: number }>) {
  const isValid = seats !== null && seats !== undefined && seats >= 0;
  const variant = getSeatVariant(seats);
  const value = isValid ? seats : '???';

  return <Badge variant={variant}>여석: {value}</Badge>;
}

export default RealtimeCard;
