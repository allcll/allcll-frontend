import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { useLiveQuery } from 'dexie-react-hooks';
import SearchSvg from '@/assets/search-white.svg?react';
import {
  BUTTON_EVENT,
  checkOngoingSimulation,
  forceStopSimulation,
  triggerButtonEvent,
} from '@/utils/simulation/simulation';
import { useReloadSimulation } from '@/hooks/useReloadSimulation';
import useLectures from '@/hooks/server/useLectures';
import LogoSvg from '@public/ci.svg?react';

function SimulationSearchForm() {
  const { setCurrentSimulation, currentSimulation, resetSimulation } = useSimulationProcessStore();
  const { openModal } = useSimulationModalStore();
  const ongoingSimulation = useLiveQuery(checkOngoingSimulation);
  const { reloadSimulationStatus } = useReloadSimulation();
  const lectures = useLectures();

  const hasRunningSimulationId =
    ongoingSimulation && 'simulationId' in ongoingSimulation ? ongoingSimulation.simulationId : -1;

  const departmentName =
    ongoingSimulation && 'userStatus' in ongoingSimulation ? ongoingSimulation.userStatus?.departmentName : -1;

  const handleClickRestart = () => {
    setCurrentSimulation({
      simulationStatus: 'before',
    });

    openModal('wish');
    resetSimulation();
  };

  const checkHasSimulation = () => {
    checkOngoingSimulation().then(simulation => {
      if (simulation && 'simulationId' in simulation && simulation.simulationId !== -1) {
        reloadSimulationStatus();
      }
    });
  };

  const handleStartSimulation = async () => {
    //버튼이벤트 : 검색 후 시뮬레이션 시작
    checkHasSimulation();

    triggerButtonEvent({ eventType: BUTTON_EVENT.SEARCH }, lectures)
      .then(result => {
        if ('errMsg' in result) {
          alert('시뮬레이션이 존재하지 않습니다. 학과 검색을 먼저 진행해주세요!');
        } else {
          const elapsedSeconds = result.elapsed_time / 1000;

          setCurrentSimulation({
            simulationStatus: 'progress',
            clickedTime: elapsedSeconds > 10 ? 5 : elapsedSeconds,
          });

          openModal('waiting');
        }
      })
      .catch(e => {
        console.error('예외 발생:', e);
      });
  };

  const handleForceSimulation = async () => {
    try {
      await forceStopSimulation();

      setCurrentSimulation({ simulationStatus: 'finish' });
      openModal('result');
    } catch (error) {
      console.error(error);
      alert('데이터베이스 삭제에 실패했습니다.');
    }
  };

  return (
    <section className="border p-2 text-xs">
      <div className="flex flex-col gap-1 sm:gap-4">
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-8">
          <div className="flex justify-end items-center sm:justify-start gap-2">
            <span className="font-bold">조직 분류</span>
            <select className="border border-gray-300 px-2 py-1 w-48 disabled:bg-gray-100" disabled>
              <option className="text-gray-100"></option>
            </select>
          </div>
          <div className="flex justify-end items-center sm:justify-start gap-2">
            <span className="font-bold">년도/학기</span>
            <select className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100 cursor-not-allowed" disabled>
              <option></option>
            </select>
          </div>
        </div>

        <div className="flex flex-col justify-between h-12 sm:flex-row gap-1 sm:gap-8">
          <div className="flex gap-2">
            <div className="flex items-center sm:justify-start gap-2">
              <span className="font-bold ">주전공(교직)</span>
              <select
                className="border-gray-300 text-gray-400 border px-2 py-1 w-48 disabled:bg-gray-100 cursor-not-allowed"
                disabled
              >
                <option>컴퓨터공학전공</option>
              </select>
            </div>
            <div className="flex items-center sm:justify-start gap-2">
              <span className="font-bold">복수전공(교직)</span>
              <select
                className="border-gray-300 text-gray-400 border px-2 py-1 w-48 disabled:bg-gray-100 cursor-not-allowed"
                disabled
              >
                <option>없음</option>
              </select>
            </div>
          </div>

          <div className="pr-10">
            {currentSimulation.simulationStatus === 'start' && (
              <LogoSvg className="w-12 h-12 animate-bounce rotate-170" />
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-col md:flex-row justify-between gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex justify-end items-center sm:justify-start gap-2">
              <span className="font-bold">검색구분</span>
              <select
                className="border-gray-300  text-gray-400 border px-2 py-1 w-48 disabled:bg-gray-100 cursor-not-allowed"
                disabled
              >
                <option>주전공검색</option>
              </select>
            </div>
            <div className="flex justify-end items-center sm:justify-start gap-1">
              <span className="font-bold">주전공</span>
              <div className="flex flex-col sm:flex-row gap-1">
                <select
                  className="border-gray-300  text-gray-400 border px-2 py-1 w-48 sm:w-30 disabled:bg-gray-100 cursor-not-allowed"
                  disabled
                >
                  <option>학부</option>
                </select>
                <select
                  className="cursor-not-allowed border px-2 py-1 w-40 lg:w-90 border-gray-300 disabled:bg-gray-100 "
                  value={departmentName}
                  disabled
                ></select>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between gap-2">
            <div className="flex flex-row ">
              {hasRunningSimulationId !== -1 ? (
                <button
                  onClick={handleForceSimulation}
                  className="px-3 py-2 bg-white border border-gray-700 cursor-pointer rounded flex flex-row gap-1"
                >
                  연습 중지
                </button>
              ) : (
                <button
                  className={`px-3 py-2 bg-blue-500 cursor-pointer rounded flex flex-row gap-1 text-white`}
                  onClick={handleClickRestart}
                >
                  재시작
                </button>
              )}
            </div>

            <button
              onClick={handleStartSimulation}
              className={`px-3 py-2 rounded flex flex-row gap-1 text-white ${
                hasRunningSimulationId === -1
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-animation cursor-pointer'
              }`}
              disabled={hasRunningSimulationId === -1}
            >
              <SearchSvg className="w-5 h-4" />
              검색
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SimulationSearchForm;
