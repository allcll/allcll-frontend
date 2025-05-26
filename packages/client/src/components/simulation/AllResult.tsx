import { useLiveQuery } from 'dexie-react-hooks';
import RadarChart from '@/components/simulation/detail/RadarChart.tsx';
import SubjectDetailResult from '@/components/simulation/detail/SubjectDetailResult.tsx';
import { getAggregatedSimulationResults, getSimulationResult } from '@/utils/simulation/result.ts';
import StatisticsChart from '@/components/simulation/detail/StatisticsChart.tsx';

function AllResult() {
  const simulationResult = useLiveQuery(() => getSimulationResult(Number(2)));
  const simulationAllResult = useLiveQuery(() => getAggregatedSimulationResults());

  const modifiedResult = simulationResult
    ? {
        ...simulationResult,
        user_ability: {
          searchBtnSpeed: simulationAllResult?.user_ability.avg_searchBtnSpeed ?? 0,
          totalSpeed: simulationAllResult?.user_ability.avg_totalSpeed ?? 0,
          accuracy: simulationAllResult?.user_ability.avg_accuracy ?? 0,
          captchaSpeed: simulationAllResult?.user_ability.avg_captchaSpeed ?? 0,
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
          {modifiedResult ? (
            <SubjectDetailResult result={modifiedResult} />
          ) : (
            <div className="text-center text-gray-500">데이터를 불러오는 중입니다...</div>
          )}
        </div>
      </div>

      <div>
        {/*Timeline */}
        {modifiedResult ? (
          <StatisticsChart result={modifiedResult} />
        ) : (
          <div className="text-center text-gray-500">데이터를 불러오는 중입니다...</div>
        )}
      </div>
    </>
  );
}

export default AllResult;
