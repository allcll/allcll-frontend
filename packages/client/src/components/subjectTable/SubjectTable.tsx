import PinIcon from '@/components/svgs/PinIcon.tsx';
import {Wishes} from '@/utils/types.ts';
import {useAddPinned, usePinned, useRemovePinned} from "@/store/usePinned.ts";
import useInfScroll from '@/hooks/useInfScroll.ts';
import {SkeletonRow} from "@/components/skeletons/SkeletonTable.tsx";
import {TableHeaders} from "@/components/wishTable/Table.tsx";
import SearchSvg from '@/assets/search.svg?react';

export interface ITableHead {
  title: string;
  key: string;
}

interface ISubjectTable {
  titles: ITableHead[];
  subjects: Wishes[];
  isPending?: boolean;
}

function SubjectTable({titles, subjects, isPending=false} : ISubjectTable) {
  const {visibleRows} = useInfScroll(subjects);

  return (
    <table className="w-full bg-white rounded-lg relative text-sm">
      <thead>
      <tr className="bg-gray-50 text-nowrap">
        {titles.map(({title}) => (
          <th key={title} className="px-4 py-2">{title}</th>
        ))}
      </tr>
      </thead>
      <tbody>
      { isPending || !subjects ? (
        Array.from({length: 5}, (_, i) => (
          <SkeletonRow length={titles.length} key={i}/>
        ))
      ) : !subjects.length ? (
        <tr>
          <td colSpan={TableHeaders.length} className="text-center py-4">
            <div className="flex flex-col items-center">
              <SearchSvg className="w-12 h-12"/>
              <p className="text-gray-500 font-bold mt-4">검색된 과목이 없습니다.</p>
              <p className="text-gray-400 text-xs mt-1">다른 검색어로 다시 시도해보세요.</p>
            </div>
          </td>
        </tr>
      ) : subjects.slice(0, visibleRows).map((subject) => (
        <TableRow key={`${subject.subjectCode} ${subject.subjectId} ${subject.professorName}`} subject={subject}/>
      ))}
      <tr className="load-more-trigger"></tr>
      </tbody>
    </table>
  )
}

function TableRow({subject} : {subject: Wishes}) {
  const {data: pinnedSubjects} = usePinned();
  const {mutate: deletePin} = useRemovePinned();
  const {mutate: addPin} = useAddPinned();

  const isPinned = pinnedSubjects?.some((pinnedSubject) => pinnedSubject.subjectId === subject.subjectId);

  const handlePin = () => {
    if (!isPinned) {
      addPin(subject.subjectId);
      return;
    }

    deletePin(subject.subjectId);
  }

  return (
    <tr className="border-t border-gray-200 text-black">
      <td className="px-4 py-2 text-center">
        <button className="cursor-pointer" onClick={handlePin}>
          <PinIcon disabled={!isPinned}/>
        </button>
      </td>
      <td className="px-2 py-2 text-center">{subject.subjectCode}-{subject.classCode}</td>
      <td className="px-2 py-2 text-center">{subject.departmentName}</td>
      <td className="px-2 py-2 text-center">{subject.subjectName}</td>
      <td className="px-2 py-2 text-center">{subject.professorName}</td>
      {/*<td className="px-4 py-2 text-center">{-1}</td>*/}
    </tr>
  )
}

export default SubjectTable;