import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import RadarChart from '@/widgets/simulation/detail/RadarChart.tsx';
import StatisticsChart from '@/widgets/simulation/detail/StatisticsChart.tsx';
import SubjectAllResult from '@/widgets/simulation/detail/SubjectAllResult.tsx';
import { getAggregatedSimulationResults } from '@/features/simulation/lib/result.ts';
import { Button, EmptyState, WarningIcon, LoadingState } from '@allcll/allcll-ui';

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
      <EmptyState icon={WarningIcon} title={simulationAllResult.error} className="w-full h-120">
        <Button asChild variant="solid" size="medium">
          <Link to="/simulation">수강 연습 시작하기</Link>
        </Button>
      </EmptyState>
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
      <LoadingState title="수강 연습 데이터 분석 중입니다." />
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
