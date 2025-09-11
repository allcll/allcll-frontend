import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import SimulationActions, {
  BUTTON_EVENT,
  checkOngoingSimulation,
  triggerButtonEvent,
} from '@/utils/simulation/simulation';
import useLectures from '@/hooks/server/useLectures';
import SearchSvg from '@/assets/search-white.svg?react';
import LogoSvg from '@public/ci.svg?react';

function SimulationSearchForm() {
  const { setCurrentSimulation, currentSimulation, resetSimulation } = useSimulationProcessStore();
  const openModal = useSimulationModalStore(state => state.openModal);
  const ongoingSimulation = useLiveQuery(checkOngoingSimulation);
  const { simulationId, startedAt, clickedTime } = currentSimulation;
  const { data: lectures } = useLectures();

  // const hasRunningSimulationId =
  //   ongoingSimulation && 'simulationId' in ongoingSimulation ? ongoingSimulation.simulationId : -1;

  /** 시뮬레이션 상태, 판단 기준
   * before: 시뮬레이션 시작 전
   * start: 시뮬레이션 시작 ~ 검색 버튼 클릭 전
   * progress: 시뮬레이션 진행 중
   * finished: 시뮬레이션 종료 (결과 모달)
   * */
  const isRunning = simulationId !== -1 && startedAt > 0;
  const isStart = isRunning && clickedTime <= 0;

  const departmentName =
    ongoingSimulation && 'userStatus' in ongoingSimulation ? ongoingSimulation.userStatus?.departmentName : -1;

  const handleClickRestart = () => {
    setCurrentSimulation({ simulationStatus: 'before' });

    openModal('tutorial');
    resetSimulation();
  };

  const handleStartSimulation = () => {
    // 시뮬레이션이 있는지 판단 // Todo: 시뮬레이션 있는 지 판단해야하는 이유??
    checkOngoingSimulation()
      .then(simulation => {
        if (simulation && 'simulationId' in simulation && simulation.simulationId !== -1) {
          SimulationActions.update();
        }

        //버튼이벤트 : 시뮬레이션 시작
        return triggerButtonEvent({ eventType: BUTTON_EVENT.SEARCH }, lectures);
      })
      .then(result => {
        if ('errMsg' in result) {
          alert('시뮬레이션이 존재하지 않습니다!');
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
    SimulationActions.finish(true);
  };

  return (
    <section className="border p-2 text-xs">
      <div className="flex flex-col gap-1 sm:gap-4">
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-8">
          <div className="flex justify-end items-center sm:justify-start gap-2">
            <MutedSelect id="organization-type" label="조직 분류" className="w-48" disabled>
              <option></option>
            </MutedSelect>
          </div>
          <div className="flex justify-end items-center sm:justify-start gap-2">
            <MutedSelect id="semester-type" label="년도/학기" className="w-48" disabled>
              <option></option>
            </MutedSelect>
          </div>
        </div>

        <div className="flex flex-col justify-between sm:flex-row gap-1 sm:gap-8">
          <div className="flex flex-col sm:items-end sm:flex-row gap-2 ">
            <div className="flex items-center justify-end sm:justify-start gap-2">
              <MutedSelect id="my-major-department" label="주전공(교직)" className="w-48" disabled>
                <option>컴퓨터공학전공</option>
              </MutedSelect>
            </div>
            <div className="flex items-center justify-end sm:justify-start gap-2">
              <MutedSelect id="my-sub-department" label="복수전공(교직)" className="w-48" disabled>
                <option>없음</option>
              </MutedSelect>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-col md:flex-row justify-between gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex justify-end items-center sm:justify-start gap-2">
              <MutedSelect id="search-division" label="검색구분" className="w-48" disabled>
                <option>주전공검색</option>
              </MutedSelect>
            </div>
            <div className="flex justify-end items-center sm:justify-start gap-1">
              <label htmlFor="search-major" className="font-bold">
                주전공
              </label>
              <div className="flex flex-col sm:flex-row gap-1">
                <select
                  id="search-major"
                  className="border-gray-300  text-gray-400 border px-2 py-1 w-48 sm:w-30 disabled:bg-gray-100 cursor-not-allowed"
                  disabled
                >
                  <option>학부</option>
                </select>
                <MutedSelect
                  id="search-department"
                  label="학과 이름"
                  className="w-40 lg:w-90"
                  value={departmentName}
                  disabled
                  hideLabel
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between gap-2">
            <div className="flex flex-row ">
              {isRunning ? (
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
              className={`relative px-3 py-2 rounded flex flex-row items-center gap-1 text-white ${
                isRunning ? 'bg-gradient-animation cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!isRunning}
            >
              {isStart && <LogoSvg className="absolute -top-20 right-8 w-15 h-15 animate-bounce rotate-170" />}
              <SearchSvg className="w-5 h-4" />
              검색
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

interface IMutedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hideLabel?: boolean;
  children?: React.ReactNode;
}

function MutedSelect({ label, hideLabel = false, children, id, className, ...props }: IMutedSelectProps) {
  const selectId = id ? id : 'muted-select-' + label;
  return (
    <>
      <label htmlFor={selectId} className={hideLabel ? 'hidden' : 'font-bold'}>
        {label}
      </label>
      <select
        id={selectId}
        className={
          'px-2 py-1 text-gray-400 border border-gray-300 disabled:bg-gray-100 cursor-not-allowed ' + className
        }
        {...props}
      >
        {children}
      </select>
    </>
  );
}

export default SimulationSearchForm;
