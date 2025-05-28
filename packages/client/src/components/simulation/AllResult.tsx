import { useLiveQuery } from 'dexie-react-hooks';
import RadarChart from '@/components/simulation/detail/RadarChart.tsx';
import StatisticsChart from '@/components/simulation/detail/StatisticsChart.tsx';
import SubjectAllResult from '@/components/simulation/detail/SubjectAllResult.tsx';
import { getAggregatedSimulationResults } from '@/utils/simulation/result.ts';

function AllResult() {
  const simulationAllResult = useLiveQuery(() => getAggregatedSimulationResults());

  const { simulations } = simulationAllResult || { simulations: [] };

  const modifiedResult = simulationAllResult
    ? {
        user_ability: {
          searchBtnSpeed: simulations.reduce((acc, sim) => acc + sim.searchBtnTime, 0) / simulations.length || 0,
          totalSpeed:
            simulations.reduce((acc, sim) => acc + sim.totalTime / sim.subjectCount, 0) / simulations.length || 0,
          accuracy: simulations.reduce((acc, sim) => acc + sim.accuracy, 0) / simulations.length || 0,
          captchaSpeed:
            simulations.reduce((acc, sim) => acc + (sim.captchaTime - sim.searchBtnTime) / sim.subjectCount, 0) /
              simulations.length || 0,
        },
      }
    : undefined;

  return (
    <>
      <div className="flex gap-3 flex-wrapㅏ">
        <div className="relative flex-1">
          {modifiedResult ? (
            <RadarChart result={modifiedResult} />
          ) : (
            <div className="text-center text-gray-500">데이터를 불러오는 중입니다...</div>
          )}
        </div>
        <div className="flex-1">
          {simulationAllResult ? (
            <SubjectAllResult result={simulationAllResult} />
          ) : (
            <div className="text-center text-gray-500">데이터를 불러오는 중입니다...</div>
          )}
        </div>
      </div>

      <div>
        {/*Timeline */}
        {simulationAllResult ? (
          <StatisticsChart result={simulationAllResult} />
        ) : (
          <div className="text-center text-gray-500">데이터를 불러오는 중입니다...</div>
        )}
      </div>
    </>
  );
}

export default AllResult;
