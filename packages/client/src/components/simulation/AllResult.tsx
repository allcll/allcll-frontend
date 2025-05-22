import { useLiveQuery } from 'dexie-react-hooks';
import RadarChart from '@/components/simulation/detail/RadarChart.tsx';
import SubjectDetailResult from '@/components/simulation/detail/SubjectDetailResult.tsx';
import { getSimulationResult } from '@/utils/simulation/result.ts';
import Timeline from '@/components/simulation/detail/Timeline.tsx';

function AllResult() {
  const simulationResult = useLiveQuery(() => getSimulationResult(Number(2)));

  return (
    <>
      <div className="flex gap-3 flex-wrapㅏ">
        <div className="relative flex-1">
          {simulationResult ? (
            <RadarChart result={simulationResult} />
          ) : (
            <div className="text-center text-gray-500">데이터를 불러오는 중입니다...</div>
          )}
        </div>
        <div className="flex-1">
          {simulationResult ? (
            <SubjectDetailResult result={simulationResult} />
          ) : (
            <div className="text-center text-gray-500">데이터를 불러오는 중입니다...</div>
          )}
        </div>
      </div>

      <div>
        {/*Timeline */}
        {simulationResult ? (
          <Timeline result={simulationResult} />
        ) : (
          <div className="text-center text-gray-500">데이터를 불러오는 중입니다...</div>
        )}
      </div>
    </>
  );
}

export default AllResult;
