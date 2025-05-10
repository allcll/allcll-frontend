import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useLiveQuery } from 'dexie-react-hooks';
import { getSimulationList } from '@/utils/simulation/result.ts';
import { SimulationRun } from '@/utils/dbConfig.ts';

function Dashboard() {
  const logs = useLiveQuery<{ snapshots: SimulationRun[] }>(getSimulationList);
  const isPending = logs === undefined;
  const isError = logs === null;

  return (
    <>
      <Helmet>
        <title>ALLCLL | 대시보드</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-6">모의 수강 신청 로그</h1>
        <div>
          <input type="text" className="border border-gray-300" />
        </div>
      </div>

      <section>
        {isPending ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-gray-500">로딩 중...</span>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-red-500">오류가 발생했습니다.</span>
          </div>
        ) : !logs?.snapshots.length ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-gray-500">로그가 없습니다.</span>
          </div>
        ) : (
          logs?.snapshots.map((log, index) => (
            <Link
              key={index}
              to={`/simulation/logs/${log.simulation_run_id}`}
              className="block bg-white p-6 rounded-2xl shadow-sm mb-2 hover:bg-gray-100"
            >
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <label className="font-bold">{log.simulation_run_id}</label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold">학과</label>
                  <span>Todo: department</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-bold">이름</label>
                  <span>{log.user_id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-bold">정확도</label>
                  <span>{log.accuracy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="font-bold">점수</label>
                  <span>{log.score}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
    </>
  );
}

export default Dashboard;
