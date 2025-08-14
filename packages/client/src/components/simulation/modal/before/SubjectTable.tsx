import { SimulationSubject } from '@/utils/types';
import ResetSvg from '@/assets/reset.svg?react';

interface ISubjectTable {
  subjects: SimulationSubject[];
  handleRemakeSubjects?: () => void;
}

function SubjectTable({ subjects, handleRemakeSubjects }: Readonly<ISubjectTable>) {
  const totalCredit = subjects.reduce((acc, subject) => {
    const credit = subject?.tm_num.split('/')[0] ?? '0';
    const subjectCredit = Number(credit) || 0;
    return acc + subjectCredit;
  }, 0);

  return (
    <>
      <div className="flex flex-row justify-between mb-4 w-full overflow-auto">
        <h2 className="text-left font-semibold">과목 리스트</h2>

        {handleRemakeSubjects && (
          <button
            onClick={handleRemakeSubjects}
            className="flex hover:font-bold hover:text-blue-500 items-center gap-2 cursor-pointer"
          >
            랜덤 과목 재생성
            <ResetSvg />
          </button>
        )}
        <p>
          총 연습 학점: <span className="text-blue-500">{totalCredit}</span>학점
        </p>
      </div>

      <div className="max-h-[250px] max-w-[350px] overflow-x-auto overflow-y-auto sm:max-w-full">
        <table className="min-w-full sm:text-sm text-xs text-left whitespace-nowrap border-t border-b border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">학수번호</th>
              <th className="px-4 py-2">분반</th>
              <th className="px-4 py-2">개설학과</th>
              <th className="px-4 py-2">과목명</th>
              <th className="px-4 py-2">교수명</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map(subject => (
              <tr key={subject.subjectId} className="border border-gray-200">
                <td className="px-4 py-2">{subject.subjectCode}</td>
                <td className="px-4 py-2">{subject.classCode}</td>
                <td className="px-4 py-2">{subject.departmentName}</td>
                <td className="px-4 py-2">{subject.subjectName}</td>
                <td className="px-4 py-2">{subject.professorName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SubjectTable;
