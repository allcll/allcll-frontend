import AlarmIcon from '@/shared/ui/svgs/AlarmIcon.tsx';
import SkeletonRows from '@/shared/ui/SkeletonRows';
import { ZeroElementRow } from '@/widgets/wishlist/Table.tsx';
import { useAddPinned, usePinned, useRemovePinned } from '@/features/live/pin/api/usePinned';
import useInfScroll from '@/shared/lib/useInfScroll.ts';
import useSearchLogging from '@/hooks/useSearchLogging.ts';
import { loggingDepartment } from '@/hooks/useSearchRank.ts';
import { WishesWithSeat } from '@/hooks/useWishesPreSeats.ts';
import { getSeatColor } from '@/shared/config/colors.ts';
import { Wishes } from '@/utils/types.ts';

export interface ITableHead {
  title: string;
  key: string;
}

interface ISubjectTable {
  titles: ITableHead[];
  subjects: Wishes[] | WishesWithSeat[];
  isPending?: boolean;
}

function PreseatSubjectTable({ titles, subjects, isPending = false }: Readonly<ISubjectTable>) {
  return (
    <table className="w-full bg-white rounded-lg relative text-sm">
      <thead>
        <tr className="bg-gray-50 text-nowrap">
          {titles.map(({ title }) => (
            <th key={title} className="px-4 py-2">
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <TableBody titles={titles} subjects={subjects} isPending={isPending} />
      </tbody>
    </table>
  );
}

function TableBody({ titles, subjects, isPending = false }: Readonly<ISubjectTable>) {
  const { visibleRows } = useInfScroll(subjects ?? [], 'selector');
  const filteredSubjects = (subjects ?? []).filter(subject => !subject.isDeleted);

  const data = filteredSubjects ? filteredSubjects.slice(0, visibleRows) : [];

  if (isPending || !filteredSubjects) {
    return <SkeletonRows row={5} col={titles.length} />;
  }

  if (!filteredSubjects.length) {
    return <ZeroElementRow col={titles.length} />;
  }

  return (
    <>
      {data.map((subject: WishesWithSeat) => (
        <TableRow key={`${subject.subjectCode} ${subject.subjectId} ${subject.professorName}`} subject={subject} />
      ))}
      <tr className="load-more-trigger" />
    </>
  );
}

function TableRow({ subject }: Readonly<{ subject: WishesWithSeat }>) {
  const isEng = subject.curiLangNm === '영어';
  const isDeleted = subject.isDeleted;
  const bgColor = isDeleted
    ? 'bg-gray-100 hover:bg-gray-200'
    : isEng
      ? 'bg-green-50 hover:bg-green-100'
      : 'bg-white hover:bg-gray-100';

  const { data: pinnedSubjects } = usePinned();
  const { mutate: deletePin } = useRemovePinned();
  const { mutate: addPin } = useAddPinned();
  const { selectTargetOnly } = useSearchLogging();

  const isPinned = pinnedSubjects?.some(pinnedSubject => pinnedSubject.subjectId === subject.subjectId);

  const handlePin = () => {
    if (!isPinned) {
      addPin(subject.subjectId);
      return;
    }

    deletePin(subject.subjectId);

    selectTargetOnly(subject.subjectId);
    loggingDepartment(subject.deptCd);
  };

  return (
    <tr className={`border-t border-gray-200 text-black ${bgColor}`}>
      <td className="px-4 py-2 text-center">
        <button
          className="cursor-pointer"
          aria-label={isPinned ? '알림 과목 해제' : '알림 과목 등록'}
          onClick={handlePin}
        >
          <AlarmIcon disabled={!isPinned} />
        </button>
      </td>
      <td className="px-2 py-2 text-center">
        {subject.subjectCode}-{subject.classCode}
      </td>
      <td className="px-2 py-2 text-center">{subject.departmentName}</td>
      <td className="px-2 py-2 text-center">{subject.subjectName}</td>
      <td className="px-2 py-2 text-center">{subject.professorName}</td>
      {/*<td className="px-4 py-2 text-center">{-1}</td>*/}
      {subject.seat !== undefined ? (
        <td className="px-2 py-2 text-center">
          {subject.seat >= 0 ? (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeatColor(subject.seat)}`}>
              {subject.seat}
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-300">-</span>
          )}
        </td>
      ) : null}
    </tr>
  );
}

export default PreseatSubjectTable;
