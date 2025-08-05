import CaptchaInput from '@/components/simulation/modal/CaptchaInput';
import SimulationModal from '@/components/simulation/modal/SimulationModal';
import SimulationResultModal from '@/components/simulation/modal/SimulationResultModal';
import UserWishModal from '@/components/simulation/modal/before/UserWishModal';
import WaitingModal from '@/components/simulation/modal/WaitingModal';
import NothingTable from '@/components/simulation/table/NothingTable';
import SubjectsTable from '@/components/simulation/table/SubjectsTable';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { checkOngoingSimulation, forceStopSimulation } from '@/utils/simulation/simulation';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SimulationSearchForm from '@/components/simulation/SimulationSearchForm';
import { useReloadSimulation } from '@/hooks/useReloadSimulation';
import useLectures from '@/hooks/server/useLectures.ts';
import Stopwatch from '@/components/simulation/Stopwatch';
import { useTimetables } from '@/hooks/server/useTimetableSchedules';

const SUBJECTS_COLUMNS_HEADER = [
  '순번',
  '신청',
  '학수번호',
  '분반',
  '개설학과',
  '교과목명',
  '수업계획서',
  '강의언어',
  '학점/이론/실습',
  '이수',
  '학년',
  '시간표',
  '인원보기',
];

function SimulationSubjectsHeader() {
  return (
    <thead className="bg-gray-100">
      <tr className="text-nowrap">
        {SUBJECTS_COLUMNS_HEADER.map(coulumn => (
          <th key={coulumn} className="border border-gray-300 px-2 py-1">
            {coulumn}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function Simulation() {
  const { type, openModal, closeModal } = useSimulationModalStore();
  const { currentSimulation, setCurrentSimulation } = useSimulationProcessStore();
  const { reloadSimulationStatus } = useReloadSimulation();
  const lectures = useLectures();
  const { data: timetables = [] } = useTimetables();

  const currentModal = useSimulationModalStore(state => state.type);

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

        if (seconds > 5 * 60) {
          forceSimulation();
        } else {
          reloadSimulationStatus();
        }
      } else if (currentSimulation.simulationStatus === 'before') {
        openModal('wish');
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

  const totalCredits = currentSimulation.successedSubjects.reduce((acc, subject) => {
    const firstNumber = subject.tm_num.split('/')[0];
    return acc + parseInt(firstNumber, 10);
  }, 0);

  const renderModal = () => {
    switch (type) {
      case 'waiting':
        return <WaitingModal />;
      case 'captcha':
        return <CaptchaInput />;
      case 'wish':
        return <UserWishModal timetables={timetables} lectures={lectures} setIsModalOpen={() => closeModal()} />;
      case 'simulation':
        return <SimulationModal reloadSimulationStatus={reloadSimulationStatus} />;
      case 'result':
        return <SimulationResultModal simulationId={currentSimulation.simulationId} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>ALLCLL | 시뮬레이션</title>
      </Helmet>

      {renderModal()}
      <div className="flex gap-5">
        <h1 className="font-bold text-lg">수강신청</h1>
        <Stopwatch />
      </div>
      <SimulationSearchForm />

      <section className="mt-4 ">
        <div className="font-semibold pl-2 mb-2 border-l-4 border-blue-500">수강 대상 교과목</div>
        <div className="overflow-x-auto min-h-[300px] border-gray-300">
          <table className="w-full border border-gray-300 border-t-3 text-xs border-t-black text-center">
            <SimulationSubjectsHeader />

            {currentSimulation.simulationStatus === 'progress' && currentModal !== 'waiting' ? (
              <SubjectsTable isRegisteredTable={false} />
            ) : (
              <NothingTable />
            )}
          </table>
        </div>
      </section>

      {/* 담은 과목인 수강신청 내역 */}
      <section className="mt-4">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-start gap-2 mb-2">
          <div className="flex flex-col sm:flex-row items-baseline gap-2">
            <span className="font-semibold pl-2 border-l-4 border-blue-500">수강 신청 내역</span>
          </div>
          <div className="flex flex-row gap-2">
            <button
              className="text-xs w-14 bg-blue-500 text-white px-2 py-0.5 rounded-xs cursor-pointer"
              onClick={reloadSimulationStatus}
            >
              재조회
            </button>
            <div className="text-xs font-bold text-black">
              수강 가능 학점: 18 /
              <span className="text-blue-500">
                신청 과목수: {currentSimulation.registeredSubjects.length} / 신청 학점수: {totalCredits}
              </span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto min-h-[300px] border-gray-300">
          <table className="w-full border border-gray-300 border-t-3 text-xs border-t-black text-center">
            <SimulationSubjectsHeader />

            {currentSimulation.simulationStatus === 'progress' && currentModal !== 'waiting' ? (
              <SubjectsTable isRegisteredTable={true} />
            ) : (
              <NothingTable />
            )}
          </table>
        </div>
      </section>
    </>
  );
}

export default Simulation;
