import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import RadarChart from '@/widgets/simulation/detail/RadarChart.tsx';
import StatisticsChart from '@/widgets/simulation/detail/StatisticsChart.tsx';
import SubjectAllResult from '@/widgets/simulation/detail/SubjectAllResult.tsx';
import { getAggregatedSimulationResults } from '@/features/simulation/lib/result.ts';
import LoadingWithMessage from '@/shared/ui/Loading.tsx';
import { WarningIcon } from '@allcll/allcll-ui';

function AllResult() {
  const simulationAllResult = useLiveQuery(async () => {
    try {
      return await getAggregatedSimulationResults();
    } catch (error: unknown) {
      return { error: (error as Error).message }; // Return null or handle the error as needed
    }
  });

  if (simulationAllResult && 'error' in simulationAllResult) {
    return (
      <div className="flex flex-col w-full items-center justify-center h-120 gap-3">
        <WarningIcon className="h-12 w-12 text-gray-300" />
        <div className="text-center text-gray-500">{simulationAllResult.error}</div>
        <Link to="/simulation" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer">
          수강 연습 시작하기
        </Link>
      </div>
    );
  }

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

  return !modifiedResult || !simulationAllResult ? (
    <div className="flex flex-col w-full items-center justify-center h-120">
      <LoadingWithMessage message="수강 연습 데이터 분석 중입니다..." />
    </div>
  ) : (
    <>
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <RadarChart result={modifiedResult} />
        </div>
        <div className="flex-1 min-w-[240px] overflow-x-auto">
          <SubjectAllResult result={simulationAllResult} />
        </div>
      </div>

      <div>
        <StatisticsChart result={simulationAllResult} />
      </div>
    </>
  );
}

export default AllResult;
