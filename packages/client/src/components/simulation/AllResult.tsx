import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import RadarChart from '@/components/simulation/detail/RadarChart.tsx';
import StatisticsChart from '@/components/simulation/detail/StatisticsChart.tsx';
import SubjectAllResult from '@/components/simulation/detail/SubjectAllResult.tsx';
import { getAggregatedSimulationResults } from '@/utils/simulation/result.ts';
import ImportantSvg from '@/assets/important.svg?react';

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
        <ImportantSvg className="h-12 w-12" />
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
      <div className="animate-spin h-16 w-16 mx-auto my-10">
        <svg className="h-16 w-16 fill-transparent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <circle className="opacity-25 stroke-blue-500" cx="12" cy="12" r="10" strokeWidth="4"></circle>
          <path
            className="opacity-75 fill-blue-500"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.243A8.001 8.001 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-1.695z"
          ></path>
        </svg>
      </div>

      <div className="text-center text-gray-500 my-10">
        수강 연습 데이터 분석 중입니다... <br />
        잠시만 기다려주세요
      </div>
    </div>
  ) : (
    <>
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1">
          <RadarChart result={modifiedResult} />
        </div>
        <div className="flex-1">
          <SubjectAllResult result={simulationAllResult} />
        </div>
      </div>

      <div>
        {/*Timeline */}
        <StatisticsChart result={simulationAllResult} />
      </div>
    </>
  );
}

export default AllResult;
