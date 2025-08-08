import { AggregatedResultResponse, ISubjectsAnalysis } from '@/utils/simulation/result.ts';
import useWishes from '@/hooks/server/useWishes.ts';
import { Wishes } from '@/utils/types.ts';
import { useMemo } from 'react';

function SubjectAllResult({ result }: Readonly<{ result: AggregatedResultResponse }>) {
  const { data: subjectNames } = useWishes();
  const resultInfo = useMemo(() => joinSubjectInfo(subjectNames, result.subjects), [subjectNames, result]);

  return (
    <table className="min-w-full text-sm text-center text-nowrap">
      <thead className="bg-gray-100 text-gray-600">
        <tr>
          <th className="py-2 px-2">학수번호</th>
          <th className="py-2 px-2">과목명</th>
          <th className="py-2 px-2">교수명</th>
          <th className="py-2 px-2">순위</th>
          <th className="py-2 px-2">관심시간</th>
          <th className="py-2 px-2">성공/실패</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {resultInfo.map(row => (
          <tr key={row.subjectId} className="border-t border-gray-200">
            <td className="py-2 px-1">{row.subjectCode + '-' + row.classCode}</td>
            <td className="py-2 px-1">{row.subjectName}</td>
            <td className="py-2 px-1">{row.professorName}</td>
            <td className="py-2 px-1">{row.avgIndex}</td>
            <td className="py-2 px-1">{row.avgCompletionTime.toFixed(2) + ' sec'}</td>
            <td className="py-2 px-2">
              <span className="px-1 py-0.5 rounded-full text-xs font-bold text-green-500">{row.successCount}</span>/
              <span className="px-1 py-0.5 rounded-full text-xs font-bold text-red-500">{row.failedCount}</span>/
              <span className="px-1 py-0.5 rounded-full text-xs font-bold text-gray-500">{row.doubledCount}</span>/
              <span className="px-1 py-0.5 rounded-full text-xs font-bold text-black">{row.totalCount}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface ISubjectAnalysis extends ISubjectsAnalysis {
  subjectName: string;
  departmentName: string;
  departmentCode: string;
  subjectCode: string;
  classCode: string;
  professorName: string | null;
}

function joinSubjectInfo(subjectNames?: Wishes[], result?: ISubjectsAnalysis[]): ISubjectAnalysis[] {
  if (!result || !subjectNames) return [];

  const findSubjectsById = (subjectId: number) => {
    return subjectNames.find(subject => subject.subjectId === subjectId);
  };

  return result.map(item => {
    const subjectInfo = findSubjectsById(item.subjectId);
    return {
      ...item,
      subjectName: subjectInfo?.subjectName || '',
      departmentName: subjectInfo?.departmentName || '',
      departmentCode: subjectInfo?.departmentCode || '',
      subjectCode: subjectInfo?.subjectCode || '',
      classCode: subjectInfo?.classCode || '',
      professorName: subjectInfo?.professorName || null,
    };
  });
}

export default SubjectAllResult;
