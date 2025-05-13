import { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import useWishes from '@/hooks/server/useWishes.ts';
import { getSimulationResult, ResultResponse } from '@/utils/simulation/result.ts';
import { Wishes } from '@/utils/types.ts';
import { findSubjectsById } from '@/utils/subjectPicker.ts';
import Timeline from '@/components/simulation/detail/Timeline.tsx';
import RadarChart from '@/components/simulation/detail/RadarChart.tsx';
import SubjectDetailResult from '@/components/simulation/detail/SubjectDetailResult.tsx';

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
        <div className="relative bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">사용자 능력 분석</h2>
          {resultInfo ? (
            <RadarChart result={resultInfo} />
          ) : (
            <div className="text-center text-gray-500">데이터를 불러오는 중입니다...</div>
          )}
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
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold mb-4">내 모의 수강 신청 별 TimeLine</h2>

          <label className="flex items-center text-sm gap-1 text-gray-500">
            <input type="checkbox" className="accent-gray-400" />
            전체 사용자 평균 보기
          </label>
        </div>
        {resultInfo ? (
          // <SubjectTimeLine result={resultInfo} />
          <Timeline result={resultInfo} />
        ) : (
          <div className="text-center text-gray-500">데이터를 불러오는 중입니다...</div>
        )}
      </section>
    </>
  );
}

export interface ExtendedResultResponse extends ResultResponse {
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
    ...result,
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
