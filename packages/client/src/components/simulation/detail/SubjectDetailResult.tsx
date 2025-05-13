import { getStausColor } from '@/utils/colors.ts';
import { APPLY_STATUS } from '@/utils/simulation/simulation.ts';
import { ExtendedResultResponse } from '@/pages/simulation/DashboardDetail.tsx';

function SubjectDetailResult({ result }: { result: ExtendedResultResponse }) {
  const { subject_results, started_at } = result;

  return (
    <table className="min-w-full text-sm text-center">
      <thead className="bg-gray-100 text-gray-600">
        <tr>
          <th className="py-2 px-2">학수번호</th>
          <th className="py-2 px-2">과목명</th>
          <th className="py-2 px-2">교수명</th>
          <th className="py-2 px-2">순위</th>
          <th className="py-2 px-2">관심시간</th>
          {/*<th className="py-2 px-2">관심</th>*/}
          <th className="py-2 px-2">성공/실패</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {subject_results.map((row, i) => (
          <tr key={i} className="border-t">
            <td className="py-2 px-1">{row.subjectInfo?.subjectCode + '-' + row.subjectInfo?.classCode}</td>
            <td className="py-2 px-1">{row.subjectInfo?.subjectName}</td>
            <td className="py-2 px-1">{row.subjectInfo?.professorName}</td>
            <td className="py-2 px-1">{row.selected_index}</td>
            <td className="py-2 px-1">{((row.ended_at - started_at) / 1000).toFixed(2) + ' sec'}</td>
            {/*<td className="py-2 px-1">*/}
            {/*  <span className={`px-2 py-0.5 rounded-full ${getWishesColor(row.subjectInfo?.totalCount ?? -1)}`}>*/}
            {/*    {row.subjectInfo?.totalCount}*/}
            {/*  </span>*/}
            {/*</td>*/}
            <td className="py-2 px-2">
              <span className={`px-2 py-0.5 rounded-full text-xs ${getStausColor(row.status)}`}>
                {row.status === APPLY_STATUS.SUCCESS ? '성공' : '실패'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SubjectDetailResult;
