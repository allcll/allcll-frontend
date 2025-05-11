import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import CheckSvg from '@/assets/check.svg?react';
import ResetSvg from '@/assets/reset.svg?react';
import { useEffect, useState } from 'react';
import { SimulationSubject } from '@/utils/types';
import { pickRandomsubjects } from '@/utils/subjectPicker';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { saveInterestedSnapshot } from '@/utils/simulation/subjects';
import { startSimulation } from '@/utils/simulation/simulation';

type Department = {
  departmentCode: string;
  departmentName: string;
};

interface UserWishModalIProp {
  department: Department;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubjectTable = ({ subjects }: { subjects: SimulationSubject[] }) => (
  <table className="w-full text-sm text-left border-t border-b border-gray-200">
    <thead className="bg-gray-100 text-gray-700">
      <tr>
        <th className="px-4 py-2">학수번호</th>
        <th className="px-4 py-2">분반</th>
        <th className="px-4 py-2">개설학과</th>
        <th className="px-4 py-2">과목명</th>
        <th className="px-4 py-2">교수명</th>
      </tr>
    </thead>
    <tbody>
      {subjects.map(subject => (
        <tr key={subject.subjectId}>
          <td className="px-4 py-2">{subject.subjectCode}</td>
          <td className="px-4 py-2">{subject.classCode}</td>
          <td className="px-4 py-2">{subject.departmentName}</td>
          <td className="px-4 py-2">{subject.subjectName}</td>
          <td className="px-4 py-2">{subject.professorName}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const GameTips = () => (
  <div className="mt-6 text-sm text-gray-800 space-y-2">
    <h2 className="text-left font-semibold mb-4">게임 Tip!</h2>
    {[
      '인기 있는 과목을 먼저 잡으세요.',
      '시작 시 검색 버튼을 빠르게 눌러주세요.',
      '한 번 담은 과목을 또 담지 않도록 주의하세요!',
    ].map((tip, idx) => (
      <div key={idx} className="flex items-center">
        <span className="text-green-500 mr-2">
          <CheckSvg />
        </span>
        {tip}
      </div>
    ))}
  </div>
);

function UserWishModal({ department, setIsModalOpen }: UserWishModalIProp) {
  const { currentSimulation, setCurrentSimulation } = useSimulationProcessStore();
  const [isCheckedSubject, setIsCheckedSubject] = useState(false);
  const { closeModal } = useSimulationModalStore();

  useEffect(() => {
    const randomSubjects = pickRandomsubjects(department);
    setCurrentSimulation({ subjects: randomSubjects });
  }, [department]);

  const handleResetRandomSubjects = () => {
    const randomSubjects = pickRandomsubjects(department);
    setCurrentSimulation({ subjects: randomSubjects });
  };

  const handleStartGame = () => {
    closeModal('wish');

    /**
     * 게임 시작 Promise 호출
     */
    saveInterestedSnapshot(
      currentSimulation.subjects.map(subject => {
        return subject.subjectId;
      }),
    )
      .then(() => {
        startSimulation()
          .then(({ simulation_id, isRunning }) => {
            setCurrentSimulation({
              simulationId: simulation_id,
              simulationStatus: isRunning ? 'start' : 'before',
            });
          })
          .catch(e => {
            console.error('시뮬레이션 시작 중 오류 발생:', e);
          });
      })
      .then(() => {});
  };

  return (
    <Modal>
      <div className="w-full max-w-3xl overflow-hidden bg-white rounded-lg border-2 border-gray-300">
        <ModalHeader
          title="수강 신청 게임을 시작하시겠습니까?"
          onClose={() => {
            setIsModalOpen(false);
          }}
        />

        <div className="p-6">
          <div className="flex flex-row justify-between">
            <h2 className="text-left font-semibold mb-4">내 관심 과목 리스트</h2>
            <button
              onClick={handleResetRandomSubjects}
              className="flex font-bold text-blue-600 items-center gap-2 cursor-pointer"
            >
              랜덤 관심 과목 재생성
              <ResetSvg />
            </button>
          </div>

          <SubjectTable subjects={currentSimulation.subjects} />

          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="confirm"
              className="mr-2"
              checked={isCheckedSubject}
              onChange={() => setIsCheckedSubject(!isCheckedSubject)}
            />
            <label htmlFor="confirm" className="text-sm text-gray-700">
              관심과목을 확인하였습니다.
            </label>
          </div>

          <GameTips />

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
