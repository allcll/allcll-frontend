import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Wishes } from '@/utils/types.ts';
import useFavorites from '@/store/useFavorites.ts';
import StarIcon from '@/components/svgs/StarIcon.tsx';
import SearchSvg from '@/assets/search.svg?react';
import SkeletonRows from '@/components/live/skeletons/SkeletonRows.tsx';
import { getWishesColor } from '@/utils/colors.ts';
import useInfScroll from '@/hooks/useInfScroll';

interface ITable {
  data: Wishes[] | undefined;
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
];

function Table({ data, isPending = false }: Readonly<ITable>) {
  return (
    <table className="w-full bg-white rounded-lg relative text-sm">
      <thead>
        <tr className="bg-gray-50 sticky top-0 z-10 text-nowrap">
          {TableHeaders.map(({ name }) => (
            <th key={name} className="px-4 py-2">
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

  if (isPending || !data) {
    return <SkeletonRows row={5} col={TableHeaders.length} />;
  }

  if (!data.length) {
    return <ZeroElementRow col={TableHeaders.length} />;
  }

  return (
    <>
      {wishes.map(course => (
        <TableRow key={`${course.subjectCode} ${course.subjectId} ${course.professorName}`} data={course} />
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
  data: Wishes;
}

const TableRow = ({ data }: TableRowProps) => {
  const getIsFavorite = useFavorites(state => state.isFavorite);
  const toggleFavorite = useFavorites(state => state.toggleFavorite);
  const [isFavorite, setIsFavorite] = useState(getIsFavorite(data.subjectId));

  const handleFavorite = () => {
    setIsFavorite(prevState => !prevState);
    toggleFavorite(data.subjectId);
  };

  return (
    <tr className="border-t border-gray-200 text-black hover:bg-gray-100">
      <td className="px-4 py-2 text-center">
        <button onClick={handleFavorite} aria-label={isFavorite ? '관심목록에서 제거' : '관심목록에 추가'}>
          <StarIcon disabled={!isFavorite} />
        </button>
      </td>

      <MemoTableRow data={data} />
    </tr>
  );
};

const equalComponent = (prevProps: TableRowProps, nextProps: TableRowProps) =>
  prevProps.data.subjectId === nextProps.data.subjectId;
const MemoTableRow = memo(({ data }: TableRowProps) => {
  return (
    <>
      {TableHeaders.slice(1, 10).map(({ key }) => (
        <td className="px-4 py-2 text-center" key={key}>
          <Link to={`/wishes/${data.subjectId}`}>
            <UiSelector data={data} headerType={key} />
          </Link>
        </td>
      ))}
    </>
  );
}, equalComponent);

function UiSelector({ data, headerType }: Readonly<{ data: Wishes; headerType: string }>) {
  switch (headerType) {
    case '':
      return <>시간표</>;
    case 'totalCount':
      return <ColoredText wishCount={data.totalCount} />;
    default:
      return data[headerType as keyof Wishes]?.toString();
  }
}

function ColoredText({ wishCount }: Readonly<{ wishCount: number }>) {
  const style = getWishesColor(wishCount);

  return <span className={`px-3 py-1 rounded-full text-xs font-bold ${style}`}>{wishCount}</span>;
}

export default Table;
