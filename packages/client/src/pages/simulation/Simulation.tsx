import CaptchaInput from '@/components/simulation/modal/CaptchaInput';
import SimulationModal from '@/components/simulation/modal/SimulationModal';
import SimulationResultModal from '@/components/simulation/modal/SimulationResultModal';
import UserWishModal from '@/components/simulation/modal/UserWishModal';
import WaitingModal from '@/components/simulation/modal/WaitingModal';
import NothingTable from '@/components/simulation/table/NothingTable';
import SubjectsTable from '@/components/simulation/table/SubjectsTable';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { checkOngoingSimulation } from '@/utils/simulation/simulation';
import { getSimulateStatus } from '@/utils/simulation/subjects';
import { findSubjectsById } from '@/utils/subjectPicker';
import { SimulationSubject } from '@/utils/types';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SimulationSearchForm from '@/components/simulation/SimulationSearchForm';

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
  const ongoingSimulation = useLiveQuery(checkOngoingSimulation);

  const hasOngoingSimulation =
    ongoingSimulation && 'simulationId' in ongoingSimulation && ongoingSimulation.simulationId !== -1;

  const currentModal = useSimulationModalStore(state => state.type);

  const loadCurrentSimulation = (
    subjects: { subjectId: number }[],
    key: 'nonRegisteredSubjects' | 'registeredSubjects',
    simulationId: number,
  ) => {
    const filteredSubjects = subjects
      .map(subject => findSubjectsById(subject.subjectId))
      .filter((subject): subject is SimulationSubject => subject !== undefined);

    setCurrentSimulation({
      simulationId: simulationId,
      simulationStatus: 'progress',
      [key]: filteredSubjects,
    });
  };

  const reloadSimulationStatus = () => {
    if (currentSimulation.simulationStatus === 'progress') {
      openModal('waiting');
    }

    getSimulateStatus()
      .then(result => {
        if (!result || result.simulationId === -1) return;

        setCurrentSimulation({
          simulationId: result.simulationId,
          department: {
            departmentCode: result?.userStatus?.departmentCode ?? '',
            departmentName: result?.userStatus?.departmentName ?? '',
          },
        });

        if (result?.nonRegisteredSubjects) {
          loadCurrentSimulation(result.nonRegisteredSubjects, 'nonRegisteredSubjects', result.simulationId);
        }

        if (result?.registeredSubjects) {
          loadCurrentSimulation(result.registeredSubjects, 'registeredSubjects', result.simulationId);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    /**
     * 새로고침 시 진행 중인 시뮬레이션이 있다면
     * 현재 시뮬레이션으로 저장
     */
    if (
      hasOngoingSimulation &&
      currentSimulation.simulationStatus !== 'selectedDepartment' &&
      currentSimulation.simulationStatus !== 'start'
    ) {
      reloadSimulationStatus();
    }

    if (!hasOngoingSimulation && currentSimulation.simulationStatus !== 'progress') {
      openModal('wish');
    }
  }, [currentSimulation.simulationStatus]);

  const totalCredits = currentSimulation.registeredSubjects.reduce((acc, subject) => {
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
        return <UserWishModal department={currentSimulation.department} setIsModalOpen={() => closeModal()} />;
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
      <h1 className="font-bold text-lg">수강신청</h1>

      <SimulationSearchForm />

      <section className="mt-4 ">
        <div className="font-semibold pl-2 mb-2 border-l-4 border-blue-500">수강 대상 교과목</div>
        <div className="overflow-x-auto min-h-[300px] border-gray-300">
          <table className="w-full border border-gray-300 border-t-3 text-xs border-t-black text-center">
            <SimulationSubjectsHeader />

            {hasOngoingSimulation ? (
              currentSimulation.simulationStatus === 'progress' && currentModal !== 'waiting' ? (
                <SubjectsTable isRegisteredTable={false} />
              ) : (
                <NothingTable />
              )
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

            {hasOngoingSimulation ? (
              currentSimulation.simulationStatus === 'progress' && currentModal !== 'waiting' ? (
                <SubjectsTable isRegisteredTable={true} />
              ) : (
                <NothingTable />
              )
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
