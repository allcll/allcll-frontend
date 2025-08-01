import Modal from '@/components/simulation/modal/Modal.tsx';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import { getSummaryResult } from '@/utils/simulation/simulation';
import { useEffect, useState } from 'react';
import ProcessingModal from './Processing';
import { NavLink } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { getAggregatedSimulationResults } from '@/utils/simulation/result';

function SimulationResultModal({ simulationId }: { simulationId: number }) {
  const { closeModal, openModal } = useSimulationModalStore();
  const [result, setResult] = useState<{ accuracy: number; score: number; total_elapsed: number } | null>(null);
  const [logParam, setLogParam] = useState<number>();

  const simulationAllResult = useLiveQuery(async () => {
    try {
      return await getAggregatedSimulationResults();
    } catch (error: unknown) {
      return { error: (error as Error).message };
    }
  });

  if (simulationAllResult && 'error' in simulationAllResult) {
    return <div className="flex flex-col w-full items-center justify-center h-120 gap-3"></div>;
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

  useEffect(() => {
    async function fetchResult() {
      getSummaryResult({ simulationId }).then(result => {
        if ('errMsg' in result) {
          alert(result.errMsg);
        } else {
          setResult(result);
          setLogParam(simulationId);
        }
      });
    }
    fetchResult().then();
  }, []);

  if (!result) {
    return <ProcessingModal />;
  }

  const { accuracy, score, total_elapsed } = result;

  const isSuccessSimulation = score >= 70;
  const speed = modifiedResult?.user_ability?.searchBtnSpeed ?? 0;

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
    <Modal>
      <div className="w-[100%] sm:w-full max-w-md bg-white rounded-xl shadow-xl p-6 relative overflow-hidden">
        {isSuccessSimulation && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="animate-float1 absolute top-6 left-6 w-3 h-3 bg-red-400 rounded-full" />
            <div className="animate-float2 absolute top-16 right-10 w-2 h-2 bg-yellow-400 rounded-full" />
            <div className="animate-float3 absolute bottom-20 left-12 w-2.5 h-2.5 bg-blue-400 rounded-full" />
            <div className="animate-float4 absolute bottom-10 right-6 w-3 h-3 bg-pink-400 rounded-full" />
            <div className="animate-float5 absolute top-1/2 left-1/2 w-2 h-2 bg-purple-400 rounded-full" />
          </div>
        )}
        <div className="relative z-10 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            수강 신청
            <span className={isSuccessSimulation ? `text-blue-600` : `text-red-500`}>
              {isSuccessSimulation ? ' 성공!' : ' 실패'}
            </span>
          </h2>
          <span className="text-sm text-gray-700 mt-1">
            수강신청에 {isSuccessSimulation ? ' 성공' : ' 실패'}하셨어요
          </span>

          <div className="flex flex-col justify-center items-center">
            <div className="m-2 flex justify-center">
              {isSuccessSimulation ? (
                <img src="/ci.svg" alt="축하 아이콘" className="w-20 h-20" />
              ) : (
                <span className="text-[50px]">💥</span>
              )}
            </div>

            <div className="flex flex-row justify-center gap-6 mt-6">
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-800 mb-1">점수</p>
                <p className="text-xl text-blue-500 font-bold whitespace-nowrap">
                  {score.toFixed(1)}
                  <span className="text-gray-600">점</span>
                </p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-800 mb-1">소요 시간</p>
                <p className="text-xl text-gray-600 font-bold whitespace-nowrap">
                  {(total_elapsed / 1000).toFixed(0)}초
                </p>
              </div>
            </div>

            <div className="flex flex-row justify-center gap-6 mt-6">
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-800 mb-1">평균 매크로 방지 입력 속도</p>
                <p className="text-xl text-blue-500 font-bold whitespace-nowrap">
                  {modifiedResult?.user_ability.captchaSpeed.toFixed(2)}
                  <span className="text-gray-600">초</span>
                </p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-800 mb-1">평균 신청 버튼 클릭 속도</p>
                <p className="text-xl text-blue-500 font-bold whitespace-nowrap">
                  {speed <= 0 ? 0 : speed.toFixed(2)}
                  <span className="text-gray-600">초</span>
                </p>
              </div>
            </div>
          </div>

          <div className="text-left text-sm text-gray-800 mt-4 mb-1">정확도</div>
          <div className="flex items-center gap-2">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-3 bg-indigo-400 rounded-full transition-all duration-300"
                style={{ width: `${accuracy}%` }}
              />
            </div>
            <p className="text-xl text-gray-600 font-bold whitespace-nowrap">{accuracy}%</p>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button
              className="px-4 py-2 border border-gray-400 text-gray-800 rounded-md hover:bg-gray-100 text-sm"
              onClick={() => {
                closeModal('result');
                openModal('wish');
              }}
            >
              다시 하기
            </button>

            <NavLink
              to={`/simulation/logs/${logParam}`}
              end={false}
              className="px-4 py-2  bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              onClick={() => {
                closeModal('result');
              }}
            >
              내 능력 자세히 보기
            </NavLink>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float1 {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        @keyframes float2 {
          0% { transform: translateY(0); }
          50% { transform: translateY(6px); }
          100% { transform: translateY(0); }
        }
        @keyframes float3 {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        @keyframes float4 {
          0% { transform: translateY(0); }
          50% { transform: translateY(4px); }
          100% { transform: translateY(0); }
        }
        @keyframes float5 {
          0% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }

        .animate-float1 { animation: float1 3s ease-in-out infinite; }
        .animate-float2 { animation: float2 4s ease-in-out infinite; }
        .animate-float3 { animation: float3 2.5s ease-in-out infinite; }
        .animate-float4 { animation: float4 3.5s ease-in-out infinite; }
        .animate-float5 { animation: float5 3s ease-in-out infinite; }
      `}</style>
    </Modal>
  );
}

export default SimulationResultModal;
