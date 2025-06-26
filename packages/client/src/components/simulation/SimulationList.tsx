import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { getSimulationList } from '@/utils/simulation/result.ts';
import { SimulationRun } from '@/utils/dbConfig.ts';
import CursorBlue from '@/assets/cursor-blue.svg?react';

function SimulationList() {
  const logs = useLiveQuery<{ snapshots: SimulationRun[] }>(getSimulationList);
  const searchedLogs = logs ? logs.snapshots : [];
  const isPending = logs === undefined;
  const isError = logs === null;

  if (searchedLogs && !searchedLogs.length) {
    return <div className="flex justify-between items-center"></div>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">모의 수강 신청 로그</h1>
      <p className="text-gray-500 mb-4">수강 연습 결과를 상세히 분석해보세요.</p>

      {isPending ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-gray-500">로딩 중...</span>
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-red-500">오류가 발생했습니다</span>
        </div>
      ) : !searchedLogs.length ? (
        <div className="flex justify-center items-center">
          <span className="text-gray-500">로그가 없습니다</span>
        </div>
      ) : (
        searchedLogs.map((log, index) => (
          <Link
            key={index}
            to={`/simulation/logs/${log.simulation_run_id}`}
            className="block bg-white p-3 rounded-md text-sm shadow-md shadow-gray-300 mb-2 hover:bg-gray-100"
          >
            <div className="grid gap-4 grid-cols-21">
              <div className="col-span-1">
                <span className="hidden">id</span>
                <span className="font-bold">{log.simulation_run_id}</span>
              </div>
              <div className="col-span-7">
                <span className="hidden">학과</span>
                <span>{log.department_name ? log.department_name.split(' ').at(-1) : '학과 정보 없음'}</span>
              </div>
              <div className="col-span-6"></div>
              <div className="col-span-4">
                <span className="text-xs">정확도 </span>
                <span className="text-sm font-bold">{log.accuracy}%</span>
              </div>
              <div className="col-span-3 flex items-center justify-end gap-2">
                <span className="hidden">점수</span>
                <CursorBlue className="w-4 h-4" />
                <span className="font-bold">{log.score.toFixed(3)}</span>
              </div>
            </div>
          </Link>
        ))
      )}
    </>
  );
}

export default SimulationList;
