import { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import useWishes from '@/hooks/server/useWishes.ts';
import { getSimulationResult, ResultResponse } from '@/utils/simulation/result.ts';
import { Wishes } from '@/utils/types.ts';
import { getStausColor } from '@/utils/colors.ts';
import { APPLY_STATUS } from '@/utils/simulation/simulation.ts';
import { findSubjectsById } from '@/utils/subjectPicker.ts';

function DashboardDetail() {
  const { runId } = useParams();
  const { data: subjects } = useWishes();
  const result = useLiveQuery(() => getSimulationResult(Number(runId)));

  const resultInfo = useMemo(() => joinSubjectInfo(subjects, result), [subjects, result]);

  return (
    <>
      <Helmet>
        <title>ALLCLL | 대시보드 상세</title>
      </Helmet>

      <h1 className="text-2xl font-bold mb-6">모의 수강 신청 로그</h1>
      {/* Top Grid: 능력분석 + 수강 신청자 리스트 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 사용자 능력 분석 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">사용자 능력 분석</h2>
          <div className="flex justify-center items-center h-64">
            {/* SVG or Radar Chart Placeholder */}
            <div className="w-60 h-60 bg-gray-100 rounded-full flex items-center justify-center text-sm text-gray-400">
              SVG 레이더 차트 삽입
            </div>
          </div>
        </div>

        {/* 과목별 수강 신청 담은 사람 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">과목 별 수강 신청 담은 사람</h2>
          {resultInfo ? (
            <SubjectDetailResult result={resultInfo} />
          ) : (
            <div className="text-center text-gray-500">데이터를 불러오는 중입니다...</div>
          )}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">내 모의 수강 신청 별 TimeLine</h2>
        {resultInfo ? (
          <SubjectTimeLine result={resultInfo} />
        ) : (
          <div className="text-center text-gray-500">데이터를 불러오는 중입니다...</div>
        )}
      </section>
    </>
  );
}

function SubjectDetailResult({ result }: { result: ExtendedResultResponse }) {
  const { subject_results } = result;

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
            <td className="py-2 px-1">{row.selected_index + '/'}</td>
            <td className="py-2 px-1">{row.ended_at + ' sec'}</td>
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

function SubjectTimeLine({ result }: { result: ExtendedResultResponse }) {
  const { timeline } = result;

  return (
    <div className="w-full overflow-x-auto">
      <div className="relative w-[900px] h-64 border-t border-l border-gray-200">
        {/* Timeline rows (예시) */}
        {timeline.map((item, i) => (
          <div key={i} className="flex items-center space-x-2 mt-4">
            <div className={`text-sm ${getStausColor(item.status)}`}>{item.subjectInfo?.subjectName}</div>
            <div className="relative flex-1 h-6">
              {item.status === APPLY_STATUS.SUCCESS ? (
                <>
                  <div className="absolute left-[50px] top-0 text-xs text-gray-600">
                    신청 버튼 클릭
                    <br />
                    {item.started_at} sec
                  </div>
                  <div className="absolute left-[150px] top-0 text-xs text-gray-600">
                    입력 완료 시간
                    <br />
                    {item.ended_at} sec
                  </div>
                  <div className="absolute left-[50px] top-5 w-[100px] h-2 bg-green-400 rounded-full"></div>
                </>
              ) : (
                <div className="absolute left-[250px] top-5 w-[100px] h-2 bg-red-400 rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ExtendedResultResponse extends ResultResponse {
  subject_results: (ResultResponse['subject_results'][number] & { subjectInfo?: any })[];
  timeline: (ResultResponse['timeline'][number] & { subjectInfo?: any })[];
  result?: ExtendedResultResponse;
}

function joinSubjectInfo(subjects?: Wishes[], result?: ResultResponse | null): ExtendedResultResponse | undefined {
  if (!result || !subjects) return undefined;

  // const searchSubject = (subjectId: number) => {
  //   return subjects.find(subject => subject.subjectId === subjectId);
  // };

  return {
    user_ability: result.user_ability,
    timeline: result.timeline.map(item => ({
      ...item,
      subjectInfo: findSubjectsById(item.subject_id),
    })),
    subject_results: result.subject_results.map(item => ({
      ...item,
      subjectInfo: findSubjectsById(item.subject_id),
    })),
  };
}

export default DashboardDetail;
