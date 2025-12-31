import React from 'react';
import { InitWishes } from '@/entities/wishes/model/useWishes.ts';
import { WishesWithSeat } from '@/entities/subjectAggregate/model/useWishesPreSeats.ts';
import usePreSeatGate from '@/widgets/live/preSeat/model/usePreSeatGate';
import { getSeatColor } from '@/shared/config/colors.ts';
import { Flex } from '@allcll/allcll-ui';

interface ISubjectDetailProps {
  wishes: WishesWithSeat | undefined;
}

/** Wishes Detail 에서 사용하는 Subject 컴포넌트 */
function SubjectDetail({ wishes }: ISubjectDetailProps) {
  const data = wishes ?? InitWishes;
  const hasPreSeats = wishes && 'seat' in wishes;
  const { isPreSeatAvailable } = usePreSeatGate({ hasSeats: hasPreSeats });

  const seats = hasPreSeats ? wishes.seat : -1;

  const isEng = wishes?.curiLangNm === '영어';
  const isDeleted = wishes?.isDeleted ?? false;

  return (
    <>
      <p className="text-gray-600">
        {data.subjectCode}-{data.classCode} | {data.departmentName} | {data.professorName}
      </p>

      <Flex gap="gap-2" align="items-center" direction="flex-wrap" className="text-gray-600 text-sm">
        <span>{data.studentYear}학년</span>
        <span>{data.curiTypeCdNm}</span>
        <span>{Number(data.tmNum.split('/')[0].trim())}학점</span>
        <span>
          {' '}
          | {data.lesnRoom} | {data.lesnTime}
        </span>

        {isPreSeatAvailable && (
          <p className={`text-sm px-2 py-1 rounded-full font-bold ${getSeatColor(seats ?? -1)}`}>
            여석: {(seats ?? -1) < 0 ? '???' : seats}
          </p>
        )}

        {isEng && <SquareBadge variant="success">영어</SquareBadge>}
        {isDeleted && <SquareBadge variant="danger">폐강</SquareBadge>}
      </Flex>
      <p className="text-sm text-gray-500">{data.remark}</p>
    </>
  );
}

interface ISquareBadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'default';
  children: React.ReactNode;
}
function SquareBadge({ variant, children }: ISquareBadgeProps) {
  const variantClass = getVariantClass(variant);

  return <div className={`${variantClass} rounded px-2 py-1 text-xs font-semibold`}>{children}</div>;
}

function getVariantClass(variant: ISquareBadgeProps['variant']) {
  switch (variant) {
    case 'success':
      return 'bg-green-100 text-green-500 ';
    case 'warning':
      return 'bg-yellow-100 text-yellow-500 ';
    case 'danger':
      return 'bg-red-100 text-red-500 ';
    case 'default':
      return 'bg-gray-100 text-gray-500 ';
    default:
      return '';
  }
}

export default SubjectDetail;
