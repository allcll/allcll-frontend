import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import SejongUI from '@allcll/sejong-ui';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { useReloadSimulation } from '@/hooks/useReloadSimulation';
import useLectures from '@/hooks/server/useLectures';
import {
  BUTTON_EVENT,
  checkOngoingSimulation,
  forceStopSimulation,
  triggerButtonEvent,
} from '@/utils/simulation/simulation';
import SearchSvg from '@/assets/search-white.svg?react';
import LogoSvg from '@public/ci.svg?react';

function SimulationSearchForm() {
  const { setCurrentSimulation, currentSimulation, resetSimulation } = useSimulationProcessStore();
  const openModal = useSimulationModalStore(state => state.openModal);
  const ongoingSimulation = useLiveQuery(checkOngoingSimulation);
  const { reloadSimulationStatus } = useReloadSimulation();
  const { data: lectures } = useLectures();

  const hasRunningSimulationId =
    ongoingSimulation && 'simulationId' in ongoingSimulation ? ongoingSimulation.simulationId : -1;
  const isRunning = hasRunningSimulationId !== -1;

  const departmentName =
    ongoingSimulation && 'userStatus' in ongoingSimulation ? ongoingSimulation.userStatus?.departmentName : -1;

  const handleClickRestart = () => {
    setCurrentSimulation({
      simulationStatus: 'before',
    });

    openModal('tutorial');
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
      <div className="flex flex-col gap-1 sm:gap-2">
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
                <SejongUI.Select id="search-major" className="w-48 sm:w-30" disabled>
                  <option>학부</option>
                </SejongUI.Select>
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
                <SejongUI.Button variant="cancel" onClick={handleForceSimulation}>
                  연습 중지
                </SejongUI.Button>
              ) : (
                <SejongUI.Button variant="primary" onClick={handleClickRestart}>
                  재시작
                </SejongUI.Button>
              )}
            </div>

            <button
              onClick={handleStartSimulation}
              className={`relative px-3 py-2 rounded flex flex-row items-center gap-1 text-white ${
                isRunning ? 'bg-gradient-animation cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!isRunning}
            >
              {currentSimulation.simulationStatus === 'start' && (
                <LogoSvg className="absolute -top-20 right-8 w-15 h-15 animate-bounce rotate-170" />
              )}
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
      <SejongUI.Select id={selectId} {...props} className={className}>
        {children}
      </SejongUI.Select>
    </>
  );
}

export default SimulationSearchForm;
