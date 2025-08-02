import { SimulationSubject } from '@/utils/types';
import ResetSvg from '@/assets/reset.svg?react';

function SubjectTable({
  subjects,
  subjectMode,
  handleRemakeSubjects,
}: {
  subjects: SimulationSubject[];
  subjectMode: 'timetable' | 'random';
  handleRemakeSubjects: () => void;
}) {
  const totalCredit = subjects.reduce((acc, subject) => {
    const subjectCredit = Number(subject.tm_num.split('/')[0]) || 0;
    return acc + subjectCredit;
  }, 0);

  return (
    <>
      <div className="flex flex-row justify-between mb-4">
        <h2 className="text-left pt-2 font-semibold flex items-center">과목 리스트</h2>
        {subjectMode === 'random' && (
          <button
            onClick={handleRemakeSubjects}
            className="flex hover:font-bold hover:text-blue-500 items-center gap-2 cursor-pointer"
          >
            랜덤 과목 재생성
            <ResetSvg />
          </button>
        )}
      </div>

      <div className="max-h-[300px]  overflow-x-auto overflow-y-auto">
        <p>
          총 연습 학점: <span className="text-blue-500">{totalCredit}</span>학점
        </p>
        <table className="min-w-full sm:text-sm text-xs text-left border-t border-b border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 min-w-[100px]">학수번호</th>
              <th className="px-4 py-2 min-w-[60px]">분반</th>
              <th className="px-4 py-2 min-w-[160px]">개설학과</th>
              <th className="px-4 py-2 min-w-[120px]">과목명</th>
              <th className="px-4 py-2 min-w-[100px]">교수명</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map(subject => (
              <tr key={subject.subjectId}>
                <td className="px-4 py-2 whitespace-nowrap">{subject.subjectCode}</td>
                <td className="px-4 py-2 whitespace-nowrap">{subject.classCode}</td>
                <td className="px-4 py-2 whitespace-nowrap">{subject.departmentName}</td>
                <td className="px-4 py-2 whitespace-nowrap">{subject.subjectName}</td>
                <td className="px-4 py-2 whitespace-nowrap">{subject.professorName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SubjectTable;
