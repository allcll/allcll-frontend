import { SimulationSubject } from '@/utils/types';

interface SubjectRowProps {
  index: number;
  subject: SimulationSubject;
  isRegisteredTable: boolean;
  onClickSubject: (subjectId: number) => void;
}

const SubjectRow = ({ index, subject, isRegisteredTable, onClickSubject }: SubjectRowProps) => {
  return (
    <tr className="hover:bg-gray-50 text-nowrap">
      <td className="border bg-blue-100 px-2 py-1 border-gray-200">{index + 1}</td>
      <td className="border py-1 border-gray-200">
        <button
          className="bg-blue-500 cursor-pointer text-white text-xs px-3 py-0.5 rounded-xs"
          disabled={!!isRegisteredTable}
          onClick={() => onClickSubject(subject.subjectId)}
        >
          {isRegisteredTable ? '삭제' : '신청'}
        </button>
      </td>
      <td className="border px-2 py-1 border-gray-200">{subject.subjectCode}</td>
      <td className="border px-2 py-1 border-gray-200">{subject.classCode}</td>
      <td className="border px-2 py-1 border-gray-200 text-left">{subject.departmentName}</td>
      <td className="border px-2 py-1 border-gray-200 text-left">{subject.subjectName}</td>
      <td className="border px-2 py-1 border-gray-200">
        <button className="bg-gray-700 text-xs text-white rounded-xs px-2 py-0.5">수업계획서</button>
      </td>
      <td className="border py-1 border-gray-200">{subject.language || '-'}</td>
      <td className="border  py-1 border-gray-200">
        {subject.tm_num
          ? subject.tm_num
              .split('/')
              .map((num: string, i: number) => (i === 0 ? parseFloat(num).toFixed(1) : num))
              .join('/')
          : '-'}
      </td>
      <td className="border px-2 py-1 border-gray-200">{subject.subjectType}</td>
      <td className="border px-2 py-1 border-gray-200">{subject.semester_at === -1 ? '' : subject.semester_at}</td>
      <td className="border px-2 py-1 border-gray-200">{subject.lesn_time || '-'}</td>
      <td className="border py-1 border-gray-200">
        <button className="bg-gray-700 text-white text-xs px-2 py-0.5 rounded-xs">수강인원</button>
      </td>
    </tr>
  );
};

export default SubjectRow;
