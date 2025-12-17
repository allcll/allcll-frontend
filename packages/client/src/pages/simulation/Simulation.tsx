import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import CaptchaInput from '@/widgets/simulation/modal/CaptchaInput.tsx';
import SimulationModal from '@/widgets/simulation/modal/SimulationModal.tsx';
import SimulationResultModal from '@/widgets/simulation/modal/SimulationResultModal.tsx';
import UserWishModal from '@/widgets/simulation/modal/before/UserWishModal';
import WaitingModal from '@/widgets/simulation/modal/WaitingModal.tsx';
import TutorialModal from '@/widgets/simulation/modal/before/TutorialModal';
import NoneRegisteredTable from '@/widgets/simulation/table/NoneRegisteredTable.tsx';
import RegisteredTable from '@/widgets/simulation/table/RegisteredTable.tsx';
import SimulationSearchForm from '@/widgets/simulation/SimulationSearchForm.tsx';
import Stopwatch from '@/widgets/simulation/Stopwatch.tsx';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { useReloadSimulation } from '@/hooks/useReloadSimulation';
import { useTimetables } from '@/entities/timetable/api/useTimetableSchedules.ts';
import { checkOngoingSimulation, forceStopSimulation, SIMULATION_TIME_LIMIT } from '@/utils/simulation/simulation';
import { VisitTutorial } from '@/utils/simulation/VisitTutorial.ts';
import SejongUI from '@allcll/sejong-ui';

function Simulation() {
  const openModal = useSimulationModalStore(state => state.openModal);
  const currentSimulation = useSimulationProcessStore(state => state.currentSimulation);
  const setCurrentSimulation = useSimulationProcessStore(state => state.setCurrentSimulation);
  const { reloadSimulationStatus } = useReloadSimulation();
  const isExpiredTutorial = VisitTutorial.get();

  const forceSimulation = async () => {
    try {
      await forceStopSimulation();
      setCurrentSimulation({ simulationStatus: 'finish' });
      alert('5분 경과로 시뮬레이션이 강제 종료되었습니다.');
      openModal('result');
    } catch (error) {
      console.error(error);
      alert('시뮬레이션 강제 종료에 실패했습니다.');
    }
  };

  const checkHasSimulation = () => {
    checkOngoingSimulation().then(simulation => {
      if (simulation && 'simulationId' in simulation && simulation.simulationId !== -1) {
        const start = simulation.startedAt;
        if (!start) {
          return;
        }
        const now = Date.now();

        const seconds = Math.floor((now - start) / 1000);

        if (seconds > SIMULATION_TIME_LIMIT) {
          forceSimulation().then();
        } else {
          reloadSimulationStatus();
        }
      } else if (currentSimulation.simulationStatus === 'before') {
        openModal('tutorial');
      }
    });
  };

  useEffect(() => {
    /**
     * 새로고침 시 진행 중인 시뮬레이션이 있다면
     * 현재 시뮬레이션으로 저장
     */
    checkHasSimulation();
  }, [currentSimulation.simulationStatus]);

  const totalCredits = currentSimulation.registeredSubjects.reduce((acc, subject) => {
    const firstNumber = subject.tm_num.split('/')[0];
    return acc + parseInt(firstNumber, 10);
  }, 0);

  return (
    <>
      <Helmet>
        <title>ALLCLL | 올클연습 - 세종대 수강신청 연습</title>
      </Helmet>

      <RenderModal />
      <div className="flex justify-between gap-5">
        <div className="flex gap-5">
          <h1 className="font-bold text-lg">수강신청 연습</h1>
          <Stopwatch />
        </div>

        {!isExpiredTutorial && (
          <button className="text-gray-600 hover:text-blue-500 cursor-pointer" onClick={VisitTutorial.reset}>
            튜토리얼 활성화
          </button>
        )}
      </div>
      <SimulationSearchForm />

      <section className="mt-4 ">
        <div className="mb-2">
          <SejongUI.SectionHeader>수강 대상 교과목</SejongUI.SectionHeader>
        </div>
        <NoneRegisteredTable />
      </section>

      {/* 담은 과목인 수강신청 내역 */}
      <section className="mt-4">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-start gap-2 mb-2">
          <SejongUI.SectionHeader>수강 신청 내역</SejongUI.SectionHeader>
          <div className="flex flex-row gap-2 items-center">
            <SejongUI.Button size="sm" onClick={reloadSimulationStatus}>
              재조회
            </SejongUI.Button>
            <span className="text-xs font-bold text-black">
              수강 가능 학점: 18 /
              <span className="text-blue-500">
                신청 과목수: {currentSimulation.registeredSubjects.length} / 신청 학점수: {totalCredits}
              </span>
            </span>
          </div>
        </div>
        <RegisteredTable />
      </section>
    </>
  );
}

function RenderModal() {
  const currentSimulation = useSimulationProcessStore(state => state.currentSimulation);
  const { type, closeModal } = useSimulationModalStore();
  const { reloadSimulationStatus } = useReloadSimulation();
  const { data: timetables = [] } = useTimetables();

  switch (type) {
    case 'tutorial':
      return <TutorialModal />;
    case 'waiting':
      return <WaitingModal />;
    case 'captcha':
      return <CaptchaInput />;
    case 'wish':
      return <UserWishModal timetables={timetables} setIsModalOpen={() => closeModal()} />;
    case 'simulation':
      return <SimulationModal reloadSimulationStatus={reloadSimulationStatus} />;
    case 'result':
      return <SimulationResultModal simulationId={currentSimulation.simulationId} />;
    default:
      return null;
  }
}

export default Simulation;
