import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Wishes } from '@/shared/model/types.ts';
import useInfScroll from '@/shared/lib/useInfScroll.ts';
import useSearchLogging from '@/features/filtering/lib/useSearchLogging.ts';
import { IPreRealSeat } from '@/entities/seat/api/usePreRealSeats';
import { loggingDepartment } from '@/features/filtering/lib/useSearchRank.ts';
import SkeletonRows from '@/shared/ui/SkeletonRows';
// import AlarmButton from '@/components/live/AlarmButton.tsx';
import FavoriteButton from '@/features/filtering/ui/button/FavoriteButton.tsx';
import { Flex } from '@allcll/allcll-ui';
import BasketBadge from '@/entities/wishes/ui/BasketBadge.tsx';
import SeatBadge from '@/entities/wishes/ui/SeatBadge.tsx';
import useHeaderSelector from '@/features/wish/lib/useHeaderSelector';
import { ZeroElementRow } from '../../shared/ui/ZeroElementRow';
import { getSubjectColorClass } from '@/entities/subjects/ui/subjectColor.ts';

interface ITable {
  data: Wishes[] | (Wishes & IPreRealSeat)[] | undefined;
  isPending?: boolean;
  placeholder: ZeroElementProps;
}

interface IBody extends ITable {
  headers: { title: string; key: string }[];
  placeholder: ZeroElementProps;
}

interface ZeroElementProps {
  title: string;
  description?: string;
}

function Table({ data, isPending = false, placeholder }: Readonly<ITable>) {
  const headers = useHeaderSelector(data);

  return (
    <table className="w-full bg-white rounded-lg relative text-sm">
      <thead>
        <tr className="bg-gray-50 sticky top-0 z-10 text-nowrap">
          {headers.map(({ title }) => (
            <th key={'table-header-name-' + title} className="px-4 py-2">
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <TableBody headers={headers} data={data} isPending={isPending} placeholder={placeholder} />
      </tbody>
    </table>
  );
}

function TableBody({ headers, data, isPending = false, placeholder }: Readonly<IBody>) {
  const { visibleRows } = useInfScroll(data ?? [], 'selector');
  const wishes = data ? data.slice(0, visibleRows) : [];

  if (isPending || !data) {
    return <SkeletonRows row={5} col={headers.length} />;
  }

  if (!data.length) {
    return <ZeroElementRow col={headers.length} {...placeholder} />;
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

interface TableRowProps {
  data: Wishes | (Wishes & IPreRealSeat);
  tableHeaders: { title: string; key: string }[];
}

const TableRow = ({ data, tableHeaders }: TableRowProps) => {
  const bgColor = getSubjectColorClass(data, true);

  return (
    <tr className={`border-t border-gray-200 text-black ${bgColor}`}>
      <td className="px-4 py-2">
        <Flex align="items-center" gap="gap-2">
          <FavoriteButton subject={data} variant="plain" />
        </Flex>
      </td>

      <MemoTableRow data={data} tableHeaders={tableHeaders} />
    </tr>
  );
};

const equalComponent = (prevProps: TableRowProps, nextProps: TableRowProps) =>
  prevProps.data.subjectId === nextProps.data.subjectId &&
  'seat' in prevProps === 'seat' in nextProps &&
  prevProps.tableHeaders === nextProps.tableHeaders;
const MemoTableRow = memo(({ data, tableHeaders }: TableRowProps) => {
  const { selectTargetOnly } = useSearchLogging();

  function handleClick() {
    selectTargetOnly(data.subjectId);
    loggingDepartment(data.departmentCode ?? data.deptCd);
  }

  return tableHeaders.slice(1, 20).map(({ key }) => (
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
      return <BasketBadge wishCount={data.totalCount ?? -1} />;
    case 'seat':
      return <SeatBadge seat={(data as IPreRealSeat).seat} />;
    default:
      return data[headerType as keyof Wishes]?.toString();
  }
}

export default Table;
