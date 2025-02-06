import {useEffect, useRef, useState, memo} from 'react';
import {Link} from 'react-router-dom';
import {Wishes} from '@/utils/types..ts';
import useFavorites from '@/store/useFavorites.ts';
import StarIcon from '@/components/svgs/StarIcon.tsx';
import SearchSvg from '@/assets/search.svg?react';
import {SkeletonRow} from '@/components/skeletons/SkeletonTable.tsx';

interface ITable {
  data: Wishes[] | undefined;
  isPending?: boolean;
}

export const TableHeaders = [
  {name: '', key: ''},
  {name: '학수번호', key: 'subjectCode'},
  {name: '분반', key: 'classCode'},
  {name: '개설 학과', key: 'departmentName'},
  {name: '과목명', key: 'subjectName'},
  {name: '교수명', key: 'professorName'},
  {name: '관심', key: 'totalCount'},
];

function Table({data, isPending=false}: ITable) {
  const [visibleRows, setVisibleRows] = useState(200);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleRows((prev) => prev + 200);
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 1.0 }
    );

    observerRef.current = observer;

    const targets = document.querySelectorAll('.load-more-trigger');
    targets.forEach((target) => observer.observe(target));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);


  return (
    <table className="w-full bg-white rounded-lg relative text-sm">
      <thead>
      <tr className="bg-gray-50 sticky top-0 z-10 text-nowrap">
        {TableHeaders.map(({name}) => (
          <th key={name} className="px-4 py-2">{name}</th>
        ))}
      </tr>
      </thead>
      <tbody>
      {isPending || !data ? (
        Array.from({length: 5}).map((_, index) => (
          <SkeletonRow key={index} length={TableHeaders.length}/>
        ))
      ) : !data.length ? (
        <tr>
          <td colSpan={TableHeaders.length} className="text-center py-4">
            <div className="flex flex-col items-center">
              <SearchSvg className="w-12 h-12"/>
              <p className="text-gray-500 font-bold mt-4">검색된 과목이 없습니다.</p>
              <p className="text-gray-400 text-xs mt-1">다른 검색어로 다시 시도해보세요.</p>
            </div>
          </td>
        </tr>
      ) :
        data.slice(0, visibleRows).map((course: Wishes) => (
        <TableRow key={course.subjectId} data={course}/>
      ))
      }
      <tr className="load-more-trigger"></tr>
      </tbody>
    </table>
  );
}

interface TableRowProps {
  data: Wishes;
}

const TableRow = ({data}: TableRowProps) => {
  const getIsFavorite = useFavorites(state => state.isFavorite);
  const toggleFavorite = useFavorites(state => state.toggleFavorite);
  const [isFavorite, setIsFavorite] = useState(getIsFavorite(data.subjectId));

  const handleFavorite = () => {
    setIsFavorite(prevState => !prevState);
    toggleFavorite(data.subjectId);
  }

  return (
    <tr className="border-t border-gray-200 text-black hover:bg-gray-100">
      <td className="px-4 py-2 text-center">
        <button onClick={handleFavorite}>
          <StarIcon disabled={!isFavorite}/>
        </button>
      </td>

      <MemoTableRow data={data}/>
    </tr>
  );
}

const equalComponent = (prevProps: TableRowProps, nextProps: TableRowProps) => prevProps.data.subjectId === nextProps.data.subjectId;
const MemoTableRow = memo(({data}: TableRowProps) => {
  return (
    <>
      {TableHeaders.slice(1, 10).map(({key}) => (
        <td className="px-4 py-2 text-center" key={key}>
          <Link to={`/wishes/${data.subjectId}`}>
            { key === '' ? '시간표' :
              key === 'totalCount' ? (
                <ColoredText wishCount={data.totalCount}/>
              ) : (
                data[key as keyof Wishes]?.toString()
              )}
          </Link>
        </td>
      ))}
    </>
  )
}, equalComponent);

function ColoredText({wishCount}: { wishCount: number }) {
  let style = 'text-green-500 bg-green-100';

  if (wishCount >= 100) {
    style = 'text-red-500 bg-red-100';
  } else if (wishCount >= 50) {
    style = 'text-yellow-500 bg-yellow-100';
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${style}`}>
      {wishCount}
    </span>
  );
}

export default Table;