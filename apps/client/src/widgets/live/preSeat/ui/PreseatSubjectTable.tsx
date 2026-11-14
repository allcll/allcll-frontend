import { NotificationFilledIcon, NotificationIcon, Table } from '@allcll/allcll-ui';
import SkeletonRows from '@/shared/ui/SkeletonRows';
import { useAddPinned, usePinned, useRemovePinned } from '@/entities/subjects/model/capabilities/usePinned.ts';
import useInfScroll from '@/shared/lib/useInfScroll.ts';
import useSearchLogging from '@/features/filtering/lib/useSearchLogging.ts';
import { loggingDepartment } from '@/features/filtering/lib/useSearchRank.ts';
import { WishesWithSeat } from '@/entities/subjectAggregate/model/useWishesPreSeats.ts';
import { getSeatColor } from '@/shared/config/colors.ts';
import { Wishes } from '@/shared/model/types.ts';
import { ZeroElementRow } from '@/shared/ui/ZeroElementRow';

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
    <Table>
      <Table.Head>
        {titles.map(({ title }) => (
          <Table.HeaderCell key={title}>{title}</Table.HeaderCell>
        ))}
      </Table.Head>
      <Table.Body>
        <TableBody titles={titles} subjects={subjects} isPending={isPending} />
      </Table.Body>
    </Table>
  );
}

function TableBody({ titles, subjects, isPending = false }: Readonly<ISubjectTable>) {
  const { visibleRows, loadMoreRef } = useInfScroll<HTMLTableRowElement>(subjects ?? []);
  const filteredSubjects = (subjects ?? []).filter(subject => !subject.isDeleted);

  const data = filteredSubjects ? filteredSubjects.slice(0, visibleRows) : [];

  if (isPending || !filteredSubjects) {
    return <SkeletonRows row={5} col={titles.length} />;
  }

  if (!filteredSubjects.length) {
    return (
      <ZeroElementRow
        col={titles.length}
        title="검색 결과가 없습니다."
        description="다른 검색어로 다시 시도해보세요."
      />
    );
  }

  return (
    <>
      {data.map((subject: WishesWithSeat) => (
        <TableRow key={`${subject.subjectCode} ${subject.subjectId} ${subject.professorName}`} subject={subject} />
      ))}
      <tr ref={loadMoreRef} />
    </>
  );
}

function TableRow({ subject }: Readonly<{ subject: WishesWithSeat }>) {
  const isEng = subject.curiLangNm === '영어';
  const isDeleted = subject.isDeleted;
  const bgColor = isDeleted
    ? 'bg-surface-muted hover:bg-surface-strong'
    : isEng
      ? 'bg-success-subtle hover:bg-success-muted'
      : 'bg-surface hover:bg-surface-muted';

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
    <Table.Row className={bgColor}>
      <Table.Cell>
        <button aria-label={isPinned ? '알림 과목 해제' : '알림 과목 등록'} onClick={handlePin}>
          {isPinned ? (
            <NotificationFilledIcon className="w-4 h-4 text-primary-500" />
          ) : (
            <NotificationIcon className="w-4 h-4 text-fg-subtle" />
          )}
        </button>
      </Table.Cell>
      <Table.Cell>
        {subject.subjectCode}-{subject.classCode}
      </Table.Cell>
      <Table.Cell>{subject.departmentName}</Table.Cell>
      <Table.Cell>{subject.subjectName}</Table.Cell>
      <Table.Cell>{subject.professorName}</Table.Cell>
      {subject.seat !== undefined ? (
        <Table.Cell>
          {subject.seat >= 0 ? (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeatColor(subject.seat)}`}>
              {subject.seat}
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-line-strong">-</span>
          )}
        </Table.Cell>
      ) : null}
    </Table.Row>
  );
}

export default PreseatSubjectTable;
