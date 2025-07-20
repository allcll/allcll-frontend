import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { useLiveQuery } from 'dexie-react-hooks';
import SearchSvg from '@/assets/search-white.svg?react';
import { BUTTON_EVENT, checkOngoingSimulation, triggerButtonEvent } from '@/utils/simulation/simulation';

function SimulationSearchForm() {
  const { currentSimulation, setCurrentSimulation, resetSimulation } = useSimulationProcessStore();
  const { openModal } = useSimulationModalStore();
  const ongoingSimulation = useLiveQuery(checkOngoingSimulation);

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

  const handleStartSimulation = async () => {
    //버튼이벤트 : 검색 후 시뮬레이션 시작
    triggerButtonEvent({ eventType: BUTTON_EVENT.SEARCH })
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

        <div className="flex flex-col sm:flex-row gap-1 sm:gap-8">
          <div className="flex justify-end items-center sm:justify-start gap-2">
            <span className="font-bold">주전공(교직)</span>
            <select className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100 cursor-not-allowed" disabled>
              <option>컴퓨터공학전공</option>
            </select>
          </div>
          <div className="flex justify-end items-center sm:justify-start gap-2">
            <span className="font-bold">복수전공(교직)</span>
            <select className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100 cursor-not-allowed" disabled>
              <option>없음</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-col md:flex-row justify-between gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex justify-end items-center sm:justify-start gap-2">
              <span className="font-bold">검색구분</span>
              <select
                className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100 cursor-not-allowed"
                disabled
              >
                <option>주전공검색</option>
              </select>
            </div>
            <div className="flex justify-end items-center sm:justify-start gap-1">
              <span className="font-bold">주전공</span>

              <div className="flex flex-col sm:flex-row gap-1">
                <select
                  className="border-gray-300 border px-2 py-1 w-48 sm:w-30 disabled:bg-gray-100 cursor-not-allowed"
                  disabled
                >
                  <option>학부</option>
                </select>
                <select
                  className="cursor-not-allowed border px-2 py-1 w-40 lg:w-90 border-gray-300 disabled:bg-gray-100 "
                  value={
                    currentSimulation.department.departmentName
                      ? currentSimulation.department.departmentName
                      : departmentName
                  }
                  disabled
                ></select>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between gap-2">
            <div className="flex flex-row ">
              <button
                onClick={handleClickRestart}
                className={`px-3 py-2 rounded flex flex-row gap-1 text-white ${
                  hasRunningSimulationId !== -1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 cursor-pointer'
                }`}
                disabled={hasRunningSimulationId !== -1}
              >
                재시작
              </button>
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
