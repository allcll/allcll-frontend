import AlarmIcon from '@/components/svgs/AlarmIcon.tsx';
import { useAddPinned, usePinned, useRemovePinned } from '@/store/usePinned.ts';
import useInfScroll from '@/hooks/useInfScroll.ts';
import { WishesWithSeat } from '@/hooks/useWishesPreSeats.ts';
import SkeletonRows from '@/components/live/skeletons/SkeletonRows.tsx';
import { ZeroElementRow } from '@/components/wishTable/Table.tsx';
import { getSeatColor } from '@/utils/colors.ts';

export interface ITableHead {
  title: string;
  key: string;
}

interface ISubjectTable {
  titles: ITableHead[];
  subjects: WishesWithSeat[];
  isPending?: boolean;
}

function SubjectTable({ titles, subjects, isPending = false }: Readonly<ISubjectTable>) {
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
  const { visibleRows } = useInfScroll(subjects);
  const data = subjects ? subjects.slice(0, visibleRows) : [];

  if (isPending || !subjects) {
    return <SkeletonRows row={5} col={titles.length} />;
  }

  if (!subjects.length) {
    return <ZeroElementRow col={titles.length} />;
  }

  return (
    <>
      {data.map(subject => (
        <TableRow key={`${subject.subjectCode} ${subject.subjectId} ${subject.professorName}`} subject={subject} />
      ))}
      <tr className="load-more-trigger" />
    </>
  );
}

function TableRow({ subject }: Readonly<{ subject: WishesWithSeat }>) {
  const { data: pinnedSubjects } = usePinned();
  const { mutate: deletePin } = useRemovePinned();
  const { mutate: addPin } = useAddPinned();

  const isPinned = pinnedSubjects?.some(pinnedSubject => pinnedSubject.subjectId === subject.subjectId);

  const handlePin = () => {
    if (!isPinned) {
      addPin(subject.subjectId);
      return;
    }

    deletePin(subject.subjectId);
  };

  return (
    <tr className="border-t border-gray-200 text-black">
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

export default SubjectTable;
