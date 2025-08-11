import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Wishes } from '@/utils/types.ts';
import { getSeatColor, getWishesColor } from '@/utils/colors.ts';
import useInfScroll from '@/hooks/useInfScroll';
import useSearchLogging from '@/hooks/useSearchLogging.ts';
import { IPreRealSeat } from '@/hooks/server/usePreRealSeats.ts';
import { loggingDepartment } from '@/hooks/useSearchRank.ts';
import SkeletonRows from '@/components/live/skeletons/SkeletonRows.tsx';
import AlarmButton from '@/components/live/AlarmButton.tsx';
import FavoriteButton from '@/components/wishTable/FavoriteButton.tsx';
import SearchSvg from '@/assets/search.svg?react';

interface ITable {
  data: Wishes[] | (Wishes & IPreRealSeat)[] | undefined;
  isPending?: boolean;
}

export const TableHeaders = [
  { name: '', key: '' },
  { name: '학수번호', key: 'subjectCode' },
  { name: '분반', key: 'classCode' },
  { name: '개설 학과', key: 'departmentName' },
  { name: '과목명', key: 'subjectName' },
  { name: '교수명', key: 'professorName' },
  { name: '관심', key: 'totalCount' },
  { name: '여석', key: 'seat' },
];

function Table({ data, isPending = false }: Readonly<ITable>) {
  const hasPreSeats = data && data[0] && 'seat' in data[0];

  const headers = hasPreSeats ? TableHeaders : TableHeaders.filter(header => header.key !== 'seat');

  return (
    <table className="w-full bg-white rounded-lg relative text-sm">
      <thead>
        <tr className="bg-gray-50 sticky top-0 z-10 text-nowrap">
          {headers.map(({ name }) => (
            <th key={'table-header-name-' + name} className="px-4 py-2">
              {name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <TableBody data={data} isPending={isPending} />
      </tbody>
    </table>
  );
}

function TableBody({ data, isPending = false }: Readonly<ITable>) {
  const { visibleRows } = useInfScroll(data ?? [], 'selector');
  const wishes = data ? data.slice(0, visibleRows) : [];

  const hasPreSeats = data && data[0] && 'seat' in data[0];

  const headers = hasPreSeats ? TableHeaders : TableHeaders.filter(header => header.key !== 'seat');

  if (isPending || !data) {
    return <SkeletonRows row={5} col={TableHeaders.length} />;
  }

  if (!data.length) {
    return <ZeroElementRow col={TableHeaders.length} />;
  }

  return (
    <>
      {wishes.map(course => (
        <TableRow
          key={`${course.subjectCode} ${course.subjectId} ${course.professorName}`}
          data={course}
          tableHeaders={headers}
        />
      ))}
      <tr className="load-more-trigger" />
    </>
  );
}

export function ZeroElementRow({ col }: Readonly<{ col: number }>) {
  return (
    <tr>
      <td colSpan={col} className="text-center py-4">
        <div className="flex flex-col items-center">
          <SearchSvg className="w-12 h-12" />
          <p className="text-gray-500 font-bold mt-4">검색된 과목이 없습니다.</p>
          <p className="text-gray-400 text-xs mt-1">다른 검색어로 다시 시도해보세요.</p>
        </div>
      </td>
    </tr>
  );
}

interface TableRowProps {
  data: Wishes | (Wishes & IPreRealSeat);
  tableHeaders: { name: string; key: string }[];
}

const TableRow = ({ data, tableHeaders }: TableRowProps) => {
  const isEng = data.curiLangNm === '영어';
  const isDeleted = data.isDeleted;
  const bgColor = isDeleted
    ? 'bg-gray-100 hover:bg-gray-200'
    : isEng
      ? 'bg-green-50 hover:bg-green-100'
      : 'bg-white hover:bg-gray-100';

  return (
    <tr className={`border-t border-gray-200 text-black ${bgColor}`}>
      <td className="px-4 py-2">
        <div className="flex items-center gap-2">
          <FavoriteButton subject={data} />
          <AlarmButton subject={data} />
        </div>
      </td>

      <MemoTableRow data={data} tableHeaders={tableHeaders} />
    </tr>
  );
};

const equalComponent = (prevProps: TableRowProps, nextProps: TableRowProps) =>
  prevProps.data.subjectId === nextProps.data.subjectId && 'seat' in prevProps === 'seat' in nextProps;
const MemoTableRow = memo(({ data, tableHeaders }: TableRowProps) => {
  const { selectTargetOnly } = useSearchLogging();

  function handleClick() {
    selectTargetOnly(data.subjectId);
    loggingDepartment(data.departmentCode);
  }

  return tableHeaders.slice(1, 10).map(({ key }) => (
    <td className="px-4 py-2 text-center" key={key}>
      <Link to={`/wishes/${data.subjectId}`} onClick={handleClick}>
        <UiSelector data={data} headerType={key} />
      </Link>
    </td>
  ));
}, equalComponent);

function UiSelector({ data, headerType }: Readonly<{ data: Wishes | (Wishes & IPreRealSeat); headerType: string }>) {
  switch (headerType) {
    case '':
      return <>시간표</>;
    case 'totalCount':
      return <ColoredText wishCount={data.totalCount} />;
    case 'seat':
      return <ColoredPreSeat seat={(data as IPreRealSeat).seat} />;
    default:
      return data[headerType as keyof Wishes]?.toString();
  }
}

function ColoredText({ wishCount }: Readonly<{ wishCount: number }>) {
  const style = getWishesColor(wishCount);

  return wishCount >= 0 ? (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${style}`}>{wishCount}</span>
  ) : (
    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-300">-</span>
  );
}

function ColoredPreSeat({ seat }: Readonly<{ seat: number }>) {
  return seat >= 0 ? (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeatColor(seat)}`}>{seat}</span>
  ) : (
    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-300">-</span>
  );
}

export default Table;
