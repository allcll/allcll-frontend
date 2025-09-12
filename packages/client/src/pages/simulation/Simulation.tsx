import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Stopwatch from '@/components/simulation/Stopwatch';
import CaptchaInput from '@/components/simulation/modal/CaptchaInput';
import WaitingModal from '@/components/simulation/modal/WaitingModal';
import SimulationModal from '@/components/simulation/modal/SimulationModal';
import SimulationResultModal from '@/components/simulation/modal/SimulationResultModal';
import UserWishModal from '@/components/simulation/modal/before/UserWishModal';
import SimulationSearchForm from '@/components/simulation/SimulationSearchForm';
import TutorialModal from '@/components/simulation/modal/before/TutorialModal';
import SubjectsSection from '@/components/simulation/SubjectsSection';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { useTimetables } from '@/hooks/server/useTimetableSchedules';
import { useTutorial } from '@/hooks/simulation/useTutorial.ts';
import { getCredit } from '@/utils/subjectPicker.ts';
import { useSimulationActions } from '@/hooks/simulation/useSimulationActions.ts';

function Simulation() {
  const currentSimulation = useSimulationProcessStore(state => state.currentSimulation);
  const { simulationId, nonRegisteredSubjects, registeredSubjects } = currentSimulation;
  const { isTutorialRequired, showTutorialAgain } = useTutorial();
  const { init, update } = useSimulationActions();

  /**새로고침 시 진행 중인 시뮬레이션이 있다면
   * 현재 시뮬레이션으로 저장 */
  useEffect(() => {
    init().then();
  }, []);

  const totalCredits = useMemo(
    () => registeredSubjects.reduce((acc, l) => acc + getCredit(l.tm_num), 0),
    [registeredSubjects],
  );

  return (
    <>
      <Helmet>
        <title>ALLCLL | 올클연습 - 세종대 수강신청 연습</title>
      </Helmet>

      <RenderModals simulationId={simulationId} />

      <div className="flex justify-between gap-5">
        <div className="flex gap-5">
          <h1 className="font-bold text-lg">수강신청 연습</h1>
          <Stopwatch />
        </div>

        {!isTutorialRequired && (
          <button className="text-gray-600 hover:text-blue-500 cursor-pointer" onClick={showTutorialAgain}>
            튜토리얼 활성화
          </button>
        )}
      </div>
      <SimulationSearchForm />

      <SubjectsSection title="수강 대상 교과목" isRegisteredTable={false} lectures={nonRegisteredSubjects} />

      <SubjectsSection title="수강 신청 내역" isRegisteredTable={true} lectures={registeredSubjects}>
        <div className="flex flex-row gap-2">
          <button
            className="text-xs w-14 bg-blue-500 text-white px-2 py-0.5 rounded-xs cursor-pointer"
            onClick={update}
          >
            재조회
          </button>
          <div className="text-xs font-bold text-black">
            수강 가능 학점: 18 /
            <span className="text-blue-500">
              신청 과목수: {registeredSubjects.length} / 신청 학점수: {totalCredits}
            </span>
          </div>
        </div>
      </SubjectsSection>
    </>
  );
}

function RenderModals({ simulationId }: Readonly<{ simulationId: number }>) {
  const type = useSimulationModalStore(state => state.type);
  const { data: timetables = [] } = useTimetables();

  switch (type) {
    case 'tutorial':
      return <TutorialModal />;
    case 'wish':
      return <UserWishModal timetables={timetables} />;
    case 'waiting':
      return <WaitingModal />;
    case 'captcha':
      return <CaptchaInput />;
    case 'simulation':
      return <SimulationModal />;
    case 'result':
      return <SimulationResultModal simulationId={simulationId} />;
    default:
      return null;
  }
}

export default Simulation;
