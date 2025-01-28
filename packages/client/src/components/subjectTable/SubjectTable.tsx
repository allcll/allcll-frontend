import PinIcon from '@/components/svgs/PinIcon.tsx';
import {Subject} from '@/utils/types..ts';

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
        <TableRow key={`${subject.code} ${subject.name} ${subject.professor}`} subject={subject}/>
      ))}
      </tbody>
    </table>
  )
}

function TableRow({subject} : {subject: any}) {
  return (
    <tr className="border-t border-gray-200 text-black">
      <td className="px-4 py-2 text-center">
        <button className="cursor-pointer" disabled={true}>
          <PinIcon disabled/>
        </button>
      </td>
      <td className="px-4 py-2 text-center">{subject.code}</td>
      <td className="px-4 py-2 text-center">{subject.name}</td>
      <td className="px-4 py-2 text-center">{subject.professor}</td>
      <td className="px-4 py-2 text-center">{subject.credits}</td>
    </tr>
  )
}

export default SubjectTable;