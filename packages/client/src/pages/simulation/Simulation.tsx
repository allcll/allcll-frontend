import CaptchaInput from '@/components/simulation/modal/CaptchaInput';
import ProcessingModal from '@/components/simulation/modal/Processing';
import SimulationModal from '@/components/simulation/modal/SimulationModal';
import SimulationResultModal from '@/components/simulation/modal/SimulationResultModal';
import UserWishModal from '@/components/simulation/modal/UserWishModal';
import WaitingModal from '@/components/simulation/modal/WaitingModal';
import SubjectsTable from '@/components/simulation/table/SubjectsTable';
import useDepartments from '@/hooks/server/useDepartments';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { BUTTON_EVENT, checkOngoingSimulation, triggerButtonEvent } from '@/utils/simulation/simulation';
import { getSimulateStatus } from '@/utils/simulation/subjects';
import { checkExistDepartment, findSubjectsById, makeValidateDepartment } from '@/utils/subjectPicker';
import { SimulationSubject } from '@/utils/types';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

function Simulation() {
  const { type, openModal, closeModal } = useSimulationModalStore();
  const { currentSimulation, setCurrentSimulation } = useSimulationProcessStore();

  const { data: departments } = useDepartments();
  const notExistDepartments = checkExistDepartment(departments);
  const newDepartments = makeValidateDepartment(departments, notExistDepartments);

  const ongoingSimulation = useLiveQuery(checkOngoingSimulation);
  const startedSimulationAt = ongoingSimulation && 'startedAt' in ongoingSimulation ? ongoingSimulation.startedAt : -1;
  const hasRunningSimulationId =
    ongoingSimulation && 'simulation_id' in ongoingSimulation ? ongoingSimulation.simulation_id : -1;

  const departmentName =
    ongoingSimulation && 'userStatus' in ongoingSimulation ? ongoingSimulation.userStatus?.departmentName : -1;
  const isPending = hasRunningSimulationId === undefined;
  const isError = hasRunningSimulationId === null;

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
  }, [currentSimulation.simulationStatus]);

  const handleChangeDepartment = (name: string) => {
    if (name === 'none') {
      setCurrentSimulation({
        department: {
          departmentCode: '',
          departmentName: '',
        },
      });
      return;
    }

    const selected = departments?.find(dept => dept.departmentName === name);
    if (selected) {
      setCurrentSimulation({
        department: {
          departmentCode: selected.departmentCode,
          departmentName: selected.departmentName,
        },
      });
    }
  };

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

  const handleSubjectSearchClick = async () => {
    // 학과 검증 로직
    if (currentSimulation.department.departmentName !== '') {
      setCurrentSimulation({
        simulationStatus: 'selectedDepartment',
      });

      openModal('wish', { department: currentSimulation.department });
    } else {
      alert('학과를 선택해주세요!');
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

      <section className="border p-2 text-xs">
        <div className="flex flex-col gap-4">
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <label className="font-bold">조직 분류</label>
              <select className="border border-gray-300 px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                <option className="text-gray-100"></option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-bold">년도/학기</label>
              <select className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                <option></option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="font-bold">주전공(교직)</label>
              <select className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                <option>컴퓨터공학전공</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-bold">복수전공(교직)</label>
              <select className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                <option>없음</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <label className="font-bold">검색구분</label>
                <select className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                  <option>관심과목검색</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="font-bold">관심과목</label>
                <select className="border-gray-300 border px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                  <option>학부</option>
                </select>
                <select
                  className={`cursor-pointer border px-2 py-1 w-120 ${hasRunningSimulationId || currentSimulation.simulationStatus === 'progress' ? ' border-gray-300 bg-gray-100' : ''}`}
                  value={
                    currentSimulation.department.departmentName
                      ? currentSimulation.department.departmentName
                      : departmentName
                  }
                  onChange={e => handleChangeDepartment(e.target.value)}
                  disabled={
                    hasRunningSimulationId !== -1 ||
                    (currentSimulation.simulationStatus !== 'before' &&
                      currentSimulation.simulationStatus !== 'selectedDepartment')
                  }
                >
                  <option value="none">전체 학과</option>
                  {newDepartments?.map(dept => (
                    <option key={dept.departmentCode} value={dept.departmentName}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleSubjectSearchClick}
              className={`px-4 py-2 rounded text-white ${
                hasRunningSimulationId !== -1 ||
                (currentSimulation.simulationStatus !== 'before' &&
                  currentSimulation.simulationStatus !== 'selectedDepartment')
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-800 cursor-pointer'
              }`}
              disabled={
                currentSimulation.simulationStatus !== 'before' &&
                currentSimulation.simulationStatus !== 'selectedDepartment'
              }
            >
              학과 검색
            </button>

            <button
              onClick={handleSearchClick}
              className={`px-4 py-2 rounded text-white ${
                hasRunningSimulationId !== -1 || currentSimulation.simulationStatus === 'before'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-800 cursor-pointer'
              }`}
            >
              검색
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-x-auto mt-4 ">
        <div className="font-semibold pl-2 mb-2 border-l-4 border-blue-500">수강 대상 교과목</div>

        <div className="overflow-x-auto min-h-[300px] border-gray-300">
          <table className="min-w-full text-center border border-gray-300 border-t-3 border-t-black text-xs ">
            <thead className="bg-gray-100">
              <tr>
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
              currentSimulation.simulationStatus === 'progress' ? (
                <SubjectsTable isRegisteredTable={false} />
              ) : (
                <tr>
                  <td colSpan={13} className="text-gray-400 py-4">
                    조회된 내역이 없습니다.
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan={13} className="text-gray-400 py-4">
                  조회된 내역이 없습니다.
                </td>
              </tr>
            )}
          </table>
        </div>
      </section>

      <section className="overflow-x-auto mt-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold pl-2 border-l-4 border-blue-500">수강 신청 내역</span>
            <button
              className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded cursor-pointer"
              onClick={fetchAndUpdateSimulationStatus}
            >
              재조회
            </button>
          </div>
          <div className="text-xs font-bold text-black">
            수강 가능 학점: 18 /
            <span className="text-blue-500">
              신청 과목수: {currentSimulation.registeredSubjects.length} / 신청 학점수:{totalCredits}
            </span>
          </div>
        </div>
        <table className="min-w-full text-center border border-gray-300 border-t-3 border-t-black text-xs">
          <thead className="bg-gray-100">
            <tr>
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
            currentSimulation.simulationStatus === 'progress' ? (
              <SubjectsTable isRegisteredTable={true} />
            ) : (
              <tr>
                <td colSpan={13} className=" text-gray-500 py-4">
                  조회된 내역이 없습니다.
                </td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan={13} className=" text-gray-500 py-4">
                조회된 내역이 없습니다.
              </td>
            </tr>
          )}
        </table>
      </section>
    </>
  );
}

export default Simulation;
