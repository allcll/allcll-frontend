import CaptchaInput from '@/components/simulation/modal/CaptchaInput';
import ProcessingModal from '@/components/simulation/modal/Processing';
import SimulationModal from '@/components/simulation/modal/SimulationModal';
import SimulationResultModal from '@/components/simulation/modal/SimulationResultModal';
import UserWishModal from '@/components/simulation/modal/UserWishModal';
import WaitingModal from '@/components/simulation/modal/WaitingModal';
import NothingTable from '@/components/simulation/table/NothingTable';
import SubjectsTable from '@/components/simulation/table/SubjectsTable';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { BUTTON_EVENT, checkOngoingSimulation, triggerButtonEvent } from '@/utils/simulation/simulation';
import { getSimulateStatus } from '@/utils/simulation/subjects';
import { findSubjectsById } from '@/utils/subjectPicker';
import { SimulationSubject } from '@/utils/types';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SearchSvg from '@/assets/search-white.svg?react';

function Simulation() {
  const { type, openModal, closeModal } = useSimulationModalStore();
  const { currentSimulation, setCurrentSimulation } = useSimulationProcessStore();

  const ongoingSimulation = useLiveQuery(checkOngoingSimulation);
  const startedSimulationAt = ongoingSimulation && 'startedAt' in ongoingSimulation ? ongoingSimulation.startedAt : -1;

  const hasRunningSimulationId =
    ongoingSimulation && 'simulationId' in ongoingSimulation ? ongoingSimulation.simulationId : -1;

  const departmentName =
    ongoingSimulation && 'userStatus' in ongoingSimulation ? ongoingSimulation.userStatus?.departmentName : -1;
  const isPending = hasRunningSimulationId === undefined;
  const isError = hasRunningSimulationId === null;

  const modalType = useSimulationModalStore(state => state.type);
  const isWaitingModalClosed = modalType !== 'waiting';

  const updateSimulation = (
    subjects: { subjectId: number }[],
    key: 'nonRegisteredSubjects' | 'registeredSubjects',
    result: any,
  ) => {
    const filteredSubjectsDetail = subjects
      .map(subject => findSubjectsById(subject.subjectId))
      .filter((subject): subject is SimulationSubject => subject !== undefined);

    setCurrentSimulation({
      simulationId: result.simulationId,
      simulationStatus: 'progress',
      started_simulation_at: startedSimulationAt,
      [key]: filteredSubjectsDetail,
    });
  };

  const fetchAndUpdateSimulationStatus = () => {
    if (currentSimulation.simulationStatus === 'progress') openModal('waiting');

    getSimulateStatus()
      .then(result => {
        if (!result || result.simulationId == -1) return;

        // Todo: 시뮬레이션 simulationId, userPK, DepartmentCode, DepartmentName 다른 곳에서도 불러오기
        setCurrentSimulation({
          simulationId: result.simulationId,
          userPK: result?.userStatus?.userPK ?? '',
          department: {
            departmentCode: result?.userStatus?.departmentCode ?? '',
            departmentName: result?.userStatus?.departmentName ?? '',
          },
        });

        if (result?.nonRegisteredSubjects) {
          updateSimulation(result.nonRegisteredSubjects, 'nonRegisteredSubjects', result);
        }

        if (result?.registeredSubjects) {
          updateSimulation(result.registeredSubjects, 'registeredSubjects', result);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    /**
     * 새로고침 시 진행 중인 시뮬레이션이 있다면
     *  현재 시뮬레이션으로 저장
     */
    if (
      hasRunningSimulationId &&
      currentSimulation.simulationStatus !== 'selectedDepartment' &&
      currentSimulation.simulationStatus !== 'start'
    ) {
      fetchAndUpdateSimulationStatus();
    }

    if (!ongoingSimulation && hasRunningSimulationId === -1 && currentSimulation.simulationStatus !== 'progress') {
      openModal('wish');
    }
  }, [currentSimulation.simulationStatus]);

  const handleSearchClick = async () => {
    /**
     * 버튼이벤트 : 검색 후 시뮬레이션 시작
     */
    triggerButtonEvent({ eventType: BUTTON_EVENT.SEARCH })
      .then(result => {
        if ('errMsg' in result) {
          alert('시뮬레이션이 존재하지 않습니다. 학과 검색을 먼저 진행해주세요!');
        } else {
          const elapsedSeconds = result.elapsed_time / 1000;

          setCurrentSimulation({
            simulationStatus: 'progress',
            clickedTime: elapsedSeconds > 10 ? Math.floor(Math.random() * 5) + 1 : elapsedSeconds,
          });

          openModal('waiting');
        }
      })
      .catch(e => {
        console.error('예외 발생:', e);
      });
  };

  const handleClickRestart = () => {
    if (hasRunningSimulationId === -1 && currentSimulation.simulationStatus !== 'progress') {
      openModal('wish');
    }
  };

  const renderModal = () => {
    switch (type) {
      case 'waiting':
        return <WaitingModal />;
      case 'captcha':
        return <CaptchaInput />;
      case 'wish':
        return <UserWishModal department={currentSimulation.department} setIsModalOpen={() => closeModal()} />;
      case 'simulation':
        return <SimulationModal fetchAndUpdateSimulationStatus={fetchAndUpdateSimulationStatus} />;
      case 'result':
        return <SimulationResultModal simulationId={currentSimulation.simulationId} />;
      default:
        return null;
    }
  };

  const totalCredits = currentSimulation.registeredSubjects.reduce((acc, subject) => {
    const firstNumber = subject.tm_num.split('/')[0];
    return acc + parseInt(firstNumber, 10);
  }, 0);

  return (
    <>
      <Helmet>
        <title>ALLCLL | 시뮬레이션</title>
      </Helmet>

      {renderModal()}
      <h1 className="font-bold text-lg">수강신청</h1>
      <section className="border p-2 text-xs">
        <div className="flex flex-col gap-1 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-8">
            <div className="flex justify-end items-center sm:justify-start gap-2">
              <label className="font-bold">조직 분류</label>
              <select className="border border-gray-300 px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                <option className="text-gray-100"></option>
              </select>
            </div>
            <div className="flex justify-end items-center sm:justify-start gap-2">
              <label className="font-bold">년도/학기</label>
              <select
                className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100 cursor-not-allowed"
                disabled
              >
                <option></option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-1 sm:gap-8">
            <div className="flex justify-end items-center sm:justify-start gap-2">
              <label className="font-bold">주전공(교직)</label>
              <select
                className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100 cursor-not-allowed"
                disabled
              >
                <option>컴퓨터공학전공</option>
              </select>
            </div>
            <div className="flex justify-end items-center sm:justify-start gap-2">
              <label className="font-bold">복수전공(교직)</label>
              <select
                className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100 cursor-not-allowed"
                disabled
              >
                <option>없음</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-col md:flex-row justify-between gap-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex justify-end items-center sm:justify-start gap-2">
                <label className="font-bold">검색구분</label>
                <select
                  className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100 cursor-not-allowed"
                  disabled
                >
                  <option>주전공검색</option>
                </select>
              </div>
              <div className="flex justify-end items-center sm:justify-start gap-1">
                <label className="font-bold">주전공</label>

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
                  >
                  </select>
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
                onClick={handleSearchClick}
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

      <section className="mt-4 ">
        <div className="font-semibold pl-2 mb-2 border-l-4 border-blue-500">수강 대상 교과목</div>

        <div className="overflow-x-auto min-h-[300px] border-gray-300">
          <table className="w-full border border-gray-300 border-t-3 text-xs border-t-black text-center">
            <thead className="bg-gray-100">
              <tr className="text-nowrap">
                {[
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
                ].map((h, i) => (
                  <th key={i} className="border border-gray-300 px-2 py-1">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            {isPending || (isError && <ProcessingModal />)}

            {hasRunningSimulationId ? (
              currentSimulation.simulationStatus === 'progress' && isWaitingModalClosed ? (
                <SubjectsTable isRegisteredTable={false} />
              ) : (
                <tbody>
                  <NothingTable />
                </tbody>
              )
            ) : (
              <tbody>
                <NothingTable />
              </tbody>
            )}
          </table>
        </div>
      </section>

      <section className="mt-4">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-start gap-2 mb-2">
          <div className="flex flex-col sm:flex-row items-baseline gap-2">
            <span className="font-semibold pl-2 border-l-4 border-blue-500">수강 신청 내역</span>
          </div>
          <div className="flex flex-row gap-2">
            <button
              className="text-xs w-14 bg-blue-500 text-white px-2 py-0.5 rounded-xs cursor-pointer"
              onClick={fetchAndUpdateSimulationStatus}
            >
              재조회
            </button>
            <div className="text-xs font-bold text-black">
              수강 가능 학점: 18 /
              <span className="text-blue-500">
                신청 과목수: {currentSimulation.registeredSubjects.length} / 신청 학점수:{totalCredits}
              </span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto ">
          <table className="min-w-full text-center border border-gray-300 border-t-3 border-t-black text-xs">
            <thead className="bg-gray-100">
              <tr className="text-nowrap">
                {[
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
                ].map((text, i) => (
                  <th key={i} className="border border-gray-300 px-2 py-1">
                    {text}
                  </th>
                ))}
              </tr>
            </thead>

            {isPending || (isError && <ProcessingModal />)}

            {hasRunningSimulationId ? (
              currentSimulation.simulationStatus === 'progress' && isWaitingModalClosed ? (
                <SubjectsTable isRegisteredTable={true} />
              ) : (
                <tbody>
                  <NothingTable />
                </tbody>
              )
            ) : (
              <tbody>
                <NothingTable />
              </tbody>
            )}
          </table>
        </div>
      </section>
    </>
  );
}

export default Simulation;
