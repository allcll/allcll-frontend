import React, { useEffect, useState } from 'react';
import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import CheckSvg from '@/assets/check.svg?react';
import ResetSvg from '@/assets/reset.svg?react';
import { DepartmentType, SimulationSubject } from '@/utils/types';
import {
  checkExistDepartment,
  makeValidateDepartment,
  pickRandomsubjects,
  pickNonRandomSubjects,
} from '@/utils/subjectPicker';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { saveInterestedSnapshot } from '@/utils/simulation/subjects';
import { startSimulation } from '@/utils/simulation/simulation';
import useDepartments from '@/hooks/server/useDepartments';

interface UserWishModalIProp {
  department: DepartmentType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubjectTable = ({ subjects }: { subjects: SimulationSubject[] }) => (
  <table className="min-w-full sm:text-sm text-xs text-left border-t border-b border-gray-200">
    <thead className="bg-gray-100 text-gray-700">
      <tr>
        <th className="px-4 py-2 min-w-[100px]">학수번호</th>
        <th className="px-4 py-2 min-w-[60px]">분반</th>
        <th className="px-4 py-2 min-w-[160px]">개설학과</th>
        <th className="px-4 py-2 min-w-[120px]">과목명</th>
        <th className="px-4 py-2 min-w-[100px]">교수명</th>
      </tr>
    </thead>
    <tbody>
      {subjects.map(subject => (
        <tr key={subject.subjectId}>
          <td className="px-4 py-2 whitespace-nowrap">{subject.subjectCode}</td>
          <td className="px-4 py-2 whitespace-nowrap">{subject.classCode}</td>
          <td className="px-4 py-2 whitespace-nowrap">{subject.departmentName}</td>
          <td className="px-4 py-2 whitespace-nowrap">{subject.subjectName}</td>
          <td className="px-4 py-2 whitespace-nowrap">{subject.professorName}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const GameTips = () => (
  <div className="mt-6 text-sm text-gray-800 space-y-2">
    <h2 className="text-left font-semibold mb-4">
      게임 <span className="text-blue-500">Tip!</span>
    </h2>
    {[
      '시작 시 우측 검색 버튼을 빠르게 눌러주세요.',
      '인기 있는 과목을 먼저 잡으세요.',
      '한 번 담은 과목을 또 담지 않도록 주의하세요!',
      '모든 과목을 담은 즉시 종료됩니다.',
    ].map((tip, idx) => (
      <div key={idx} className="flex items-center sm:text-sm text-xs ">
        <span className="text-blue-500 mr-2">
          <CheckSvg />
        </span>
        <span className={idx === 0 ? 'font-semibold text-blue-500 animate-bounce' : ''}>{tip}</span>
      </div>
    ))}
  </div>
);

function UserWishModal({ department, setIsModalOpen }: UserWishModalIProp) {
  const { currentSimulation, setCurrentSimulation } = useSimulationProcessStore();
  const [isCheckedSubject, setIsCheckedSubject] = useState(false);
  const { closeModal } = useSimulationModalStore();

  const { data: departments } = useDepartments();
  const notExistDepartments = checkExistDepartment(departments);
  const newDepartments = makeValidateDepartment(departments, notExistDepartments);

  useEffect(() => {
    const randomSubjects = pickNonRandomSubjects(department);
    setCurrentSimulation({ simulatonSubjects: randomSubjects });
  }, [department]);

  const handleResetRandomSubjects = () => {
    const randomSubjects = pickRandomsubjects(department);
    setCurrentSimulation({ simulatonSubjects: randomSubjects });
  };

  const handleStartGame = async () => {
    try {
      closeModal('wish');

      /**
       * 관심과목 스냅샷 저장 후
       * 게임 시작 Promise 호출
       */
      await saveInterestedSnapshot(currentSimulation.simulatonSubjects.map(subject => subject.subjectId));

      const result = await startSimulation('', department.departmentCode, department.departmentName);

      if (
        'simulationId' in result &&
        'isRunning' in result &&
        result.simulationId !== -1 &&
        result.isRunning !== undefined
      ) {
        const { simulationId, isRunning } = result;

        setCurrentSimulation({
          simulationId,
          simulationStatus: isRunning ? 'start' : 'before',
        });
      } else {
        console.error('시뮬레이션 시작 결과가 유효하지 않음', result);
      }
    } catch (e) {
      console.error('시뮬레이션 시작 중 오류 발생:', e);
    }
  };

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

  return (
    <Modal>
      <div className="w-full max-w-3xl my-6 mx-5 sm:my-6 sm:mx-5 xs:my-2 xs:mx-2 sm:text-sm text-xs overflow-hidden bg-white rounded-lg border-2 border-gray-300">
        <ModalHeader
          title="수강 신청 연습을 시작하시겠습니까?"
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
        <div className="p-6">
          <h2 className="text-left font-semibold mb-2">학과 검색</h2>
          <select
            className="cursor-pointer border border-gray-300 rounded-sm px-2 py-1 w-50 sm:w-120 bg-white mb-4"
            value={department.departmentName}
            onChange={e => handleChangeDepartment(e.target.value)}
          >
            <option value="학과를 선택하지 않았습니다.">학과가 목록에 없어요</option>
            {newDepartments?.map(dept => (
              <option key={dept.departmentCode} value={dept.departmentName}>
                {dept.departmentName}
              </option>
            ))}
          </select>
          <div className="flex flex-row justify-between mb-4">
            <h2 className="text-left font-semibold flex items-center">수강 신청 과목 리스트</h2>
            <button
              onClick={handleResetRandomSubjects}
              className="flex hover:font-bold hover:text-blue-500 items-center gap-2 cursor-pointer"
            >
              랜덤 과목 재생성
              <ResetSvg />
            </button>
          </div>

          <div className="max-h-[300px]  overflow-x-auto overflow-y-auto">
            <SubjectTable subjects={currentSimulation.simulatonSubjects} />
          </div>

          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="confirm"
              className="mr-2 cursor-pointer"
              checked={isCheckedSubject}
              onChange={() => setIsCheckedSubject(!isCheckedSubject)}
            />
            <label htmlFor="confirm" className="mr-2 cursor-pointer text-sm text-gray-700">
              수강 신청 과목을 확인하였습니다.
            </label>
          </div>

          {isCheckedSubject && <GameTips />}

          <div className="pt-6 text-right">
            <button
              onClick={handleStartGame}
              className={`px-6 py-2 bg-blue-500 cursor-pointer text-white font-semibold rounded-md hover:bg-blue-600 ${isCheckedSubject ? '' : 'opacity-50 cursor-not-allowed'}`} // 체크되지 않으면 비활성화
              disabled={!isCheckedSubject}
            >
              시작하기
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default UserWishModal;
