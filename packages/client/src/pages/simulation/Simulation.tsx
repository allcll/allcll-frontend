import CaptchaInput from '@/components/simulation/modal/CaptchaInput';
import ProcessingModal from '@/components/simulation/modal/Processing';
import SimulationModal from '@/components/simulation/modal/SimulationModal';
import SimulationResultModal from '@/components/simulation/modal/SimulationResultModal';
import UserWishModal from '@/components/simulation/modal/UserWishModal';
import WaitingModal from '@/components/simulation/modal/WaitingModal';
import SubjectsTable from '@/components/simulation/SubjectsTable';
import useDepartments from '@/hooks/server/useDepartments';
import { useInterestedSubjectList } from '@/hooks/simulation/useFavorite';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { BUTTON_EVENT, checkOngoingSimulation, triggerButtonEvent } from '@/utils/simulation/simulation';
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

  const hasRunningSimulationId = useLiveQuery(checkOngoingSimulation)?.simulation_id;
  const isPending = hasRunningSimulationId === undefined;
  const isError = hasRunningSimulationId === null;

  const { data: subjects, isPending: isSubjectPending } = useInterestedSubjectList();

  useEffect(() => {
    /**
     * 새로고침 시 진행 중인 시뮬레이션이 있다면
     *  현재 시뮬레이션으로 저장
     */
    if (hasRunningSimulationId && subjects && currentSimulation.simulationStatus !== 'selectedDepartment') {
      if (subjects) {
        const filteredSubjectsDetail = subjects
          .map(subject => findSubjectsById(subject.subject_id))
          .filter((subject): subject is SimulationSubject => subject !== undefined);

        setCurrentSimulation({
          simulationId: hasRunningSimulationId,
          simulationStatus: 'progress',
          subjects: filteredSubjectsDetail,
        });
      }
    }
  }, [subjects]);

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
          const elapsedSeconds = Math.floor(result.elapsed_time / 1000);

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

  const handleSubjectSearchClick = () => {
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
        return <SimulationModal />;
      case 'result':
        return <SimulationResultModal />;
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

      <section className="border p-2 text-xs">
        <div className="flex flex-col gap-4">
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <label className="font-bold">조직 분류</label>
              <select className="border px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                <option></option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-bold">년도/학기</label>
              <select className="border px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                <option></option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="font-bold">주전공(교직)</label>
              <select className="border px-2 py-1 w-48">
                <option>컴퓨터공학전공</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-bold">복수전공(교직)</label>
              <select className="border px-2 py-1 w-48">
                <option>없음</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-bold">학번</label>
              <input className="border px-2 py-1 w-48" placeholder="2022123456" />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-bold">이름</label>
              <input className="border px-2 py-1 w-48" placeholder="홍길동" />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-bold">전화번호</label>
              <input className="border px-2 py-1 w-48" placeholder="010-1234-5678" />
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <label className="font-bold">검색구분</label>
                <select className="border px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                  <option>관심과목검색</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="font-bold">관심과목</label>
                <select className="border px-2 py-1 w-48 disabled:bg-gray-100" disabled>
                  <option>학부</option>
                </select>
                <select
                  className={`border px-2 py-1 w-120 ${hasRunningSimulationId ? 'bg-gray-100' : ''}`}
                  value={currentSimulation.department.departmentName}
                  onChange={e => handleChangeDepartment(e.target.value)}
                  disabled={hasRunningSimulationId !== -1}
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
                hasRunningSimulationId !== -1
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-800 cursor-pointer'
              }`}
              disabled={hasRunningSimulationId !== -1}
            >
              학과 검색
            </button>

            <button onClick={handleSearchClick} className="bg-gray-700 text-white px-4 py-2 rounded cursor-pointer">
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

            {isSubjectPending && <ProcessingModal />}

            {isPending || isError || type === 'waiting' ? (
              <tr>
                <td colSpan={13} className="text-gray-400 py-4">
                  조회된 내역이 없습니다.
                </td>
              </tr>
            ) : hasRunningSimulationId ? (
              currentSimulation.simulationStatus === 'progress' && <SubjectsTable />
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
            <button className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">재조회</button>
          </div>
          <div className="text-xs font-bold text-black">
            수강 가능 학점: 18 / <span className="text-blue-500">신청 과목수: 4 / 신청 학점수: 10.5</span>
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
          <tbody>
            <tr>
              <td colSpan={13} className="text-gray-400 py-4">
                조회된 내역이 없습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}

export default Simulation;
