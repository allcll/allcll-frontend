import { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { getSimulationResult, ResultResponse } from '@/features/simulation/lib/result.ts';
import { findSubjectsById } from '@/features/simulation/lib/subjectPicker.ts';
import Timeline from '@/widgets/simulation/detail/Timeline.tsx';
import RadarChart from '@/widgets/simulation/detail/RadarChart.tsx';
import SubjectDetailResult from '@/widgets/simulation/detail/SubjectDetailResult.tsx';
import useLectures, { Lecture } from '@/entities/subjects/model/useLectures.ts';

function DashboardDetail() {
  const { runId } = useParams();
  const { data: lectures } = useLectures();

  const result = useLiveQuery(() => getSimulationResult(Number(runId)));

  const resultInfo = useMemo(() => joinSubjectInfo(lectures, result), [lectures, result]);

  return (
    <>
      <Helmet>
        <title>ALLCLL | 올클연습 - 결과 분석 상세</title>
        <meta name="description" content="수강연습 결과를 분석하고, 부족한 부분을 알려 드려요." />
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
          <h2 className="text-lg font-semibold mb-4 min-w-[240px] overflow-x-auto">과목 별 분석</h2>
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

          {/*<label className="flex items-center text-sm gap-1 text-gray-500">*/}
          {/*  <input type="checkbox" className="accent-gray-400" />*/}
          {/*  전체 사용자 평균 보기*/}
          {/*</label>*/}
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

function joinSubjectInfo(subjects?: Lecture[], result?: ResultResponse | null): ExtendedResultResponse | undefined {
  if (!result || !subjects) return undefined;

  return {
    ...result,
    timeline: result.timeline.map(item => ({
      ...item,
      subjectInfo: findSubjectsById(subjects, item.subject_id),
    })),
    subject_results: result.subject_results.map(item => ({
      ...item,
      subjectInfo: findSubjectsById(subjects, item.subject_id),
    })),
  };
}

export default DashboardDetail;
