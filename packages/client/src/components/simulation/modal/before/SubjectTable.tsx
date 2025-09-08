import { Lecture } from '@/hooks/server/useLectures.ts';
import ResetSvg from '@/assets/reset.svg?react';
import SkeletonRows from '@/components/live/skeletons/SkeletonRows';
import { getCredit } from '@/utils/subjectPicker.ts';

interface ISubjectTable {
  isLoadingLectures: boolean;
  subjects: Lecture[];
  handleRemakeSubjects?: () => void;
}

function SubjectTable({ subjects, handleRemakeSubjects, isLoadingLectures }: Readonly<ISubjectTable>) {
  const totalCredit = subjects?.reduce((acc, subject) => acc + getCredit(subject?.tm_num ?? '0'), 0);

  return (
    <>
      <div className="flex flex-row justify-between items-end w-full overflow-auto">
        <h2 className="text-left font-semibold">과목 리스트</h2>

        {handleRemakeSubjects && (
          <button
            onClick={handleRemakeSubjects}
            className="flex hover:font-bold hover:text-blue-500 items-center gap-2 cursor-pointer"
          >
            랜덤과목 재생성
            <ResetSvg />
          </button>
        )}
        <p>
          총 연습 학점: <span className="text-blue-500">{totalCredit}</span>학점
        </p>
      </div>

      <div className="overflow-x-auto sm:max-w-full">
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
            {!isLoadingLectures ? (
              subjects?.map((subject, index) => (
                <tr key={subject?.subjectId ?? index} className="border border-gray-200">
                  <td className="px-4 py-2">{subject?.subjectCode ?? ''}</td>
                  <td className="px-4 py-2">{subject?.classCode ?? ''}</td>
                  <td className="px-4 py-2">{subject?.departmentName ?? ''}</td>
                  <td className="px-4 py-2">{subject?.subjectName ?? ''}</td>
                  <td className="px-4 py-2">{subject?.professorName ?? ''}</td>
                </tr>
              ))
            ) : (
              <SkeletonRows col={5} row={8} />
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SubjectTable;
