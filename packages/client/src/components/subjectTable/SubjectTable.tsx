import PinIcon from '@/components/svgs/PinIcon.tsx';
import {Subject} from '@/utils/types..ts';
import {useAddPinned, usePinned, useRemovePinned} from "@/store/usePinned.ts";

export interface ITableHead {
  title: string;
  key: string;
}

interface ISubjectTable {
  titles: ITableHead[];
  subjects: Subject[];
}

function SubjectTable({titles, subjects} : ISubjectTable) {
  return (
    <table className="w-full bg-white rounded-lg">
      <thead>
      <tr className="bg-gray-50">
        {titles.map(({title}) => (
          <th key={title} className="px-4 py-2">{title}</th>
        ))}
      </tr>
      </thead>
      <tbody>
      {subjects.map((subject) => (
        <TableRow key={`${subject.subjectCode} ${subject.subjectId} ${subject.professorName}`} subject={subject}/>
      ))}
      </tbody>
    </table>
  )
}

function TableRow({subject} : {subject: Subject}) {
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
      <td className="px-4 py-2 text-center">{subject.subjectCode}</td>
      <td className="px-4 py-2 text-center">{subject.subjectName}</td>
      <td className="px-4 py-2 text-center">{subject.professorName}</td>
      <td className="px-4 py-2 text-center">{-1}</td>
    </tr>
  )
}

export default SubjectTable;