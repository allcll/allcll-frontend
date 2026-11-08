import { InitWishes } from '@/entities/wishes/model/useWishes.ts';
import { WishesWithSeat } from '@/entities/subjectAggregate/model/useWishesPreSeats.ts';
import usePreSeatGate from '@/entities/seat/model/usePreSeatGate';
import SeatBadge from '@/entities/wishes/ui/SeatBadge.tsx';
import { Badge, Flex } from '@allcll/allcll-ui';
import { joinPresent } from '@/shared/lib/stringFormats.ts';
import { parseCredit } from '@/shared/lib/parser.ts';

interface ISubjectDetailProps {
  wishes: WishesWithSeat | undefined;
}

/** Wishes Detail 에서 사용하는 Subject 컴포넌트 */
function SubjectDetail({ wishes }: ISubjectDetailProps) {
  const data = wishes ?? InitWishes;
  const hasPreSeats = !!(wishes && 'seat' in wishes);
  const { isPreSeatAvailable } = usePreSeatGate({ hasSeats: hasPreSeats });

  const seats = hasPreSeats ? wishes.seat : -1;

  const isEng = wishes?.curiLangNm === '영어';
  const isDeleted = wishes?.isDeleted ?? false;
  const credit = parseCredit(data.tmNum);

  return (
    <>
      <p className="text-gray-600">
        {joinPresent([`${data.subjectCode}-${data.classCode}`, data.departmentName, data.professorName])}
      </p>

      <Flex gap={2} align="center" wrap className="text-gray-600 text-sm">
        <span>
          {joinPresent([
            data.studentYear && `${data.studentYear}학년`,
            data.curiTypeCdNm,
            credit > 0 && `${credit}학점`,
            data.lesnRoom,
            data.lesnTime,
          ])}
        </span>

        {isPreSeatAvailable && <SeatBadge seat={seats ?? -1} formatter={value => `여석 ${value}`} />}
        {isEng && <Badge color="success">영어</Badge>}
        {isDeleted && <Badge color="danger">폐강</Badge>}
      </Flex>
      <p className="text-sm text-gray-500">{data.remark}</p>
    </>
  );
}

export default SubjectDetail;
