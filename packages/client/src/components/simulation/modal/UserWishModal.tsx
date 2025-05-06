import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import CheckSvg from '@/assets/check.svg?react';
import ResetSvg from '@/assets/reset.svg?react';
import lecturesData from '@public/lectures.json';
import { useEffect, useState } from 'react';
import { SimulationSubject } from '@/utils/types';

interface UserWishModalIProp {
  department: string;
}

function getRandomItems<T>(arr: T[], count: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(count, arr.length));
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
        <tr key={subject.id}>
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

function UserWishModal({ department }: UserWishModalIProp) {
  const [subjects, setSubjects] = useState<SimulationSubject[]>([]);

  const generateRandomSubjects = () => {
    const departmentSubjects = lecturesData.subjects.filter(subject => subject.departmentName === department);
    const humanitySubjects = lecturesData.subjects.filter(subject => subject.departmentName === '대양휴머니티칼리지');

    const uniqueDepartmentSubjects = Array.from(
      new Map(departmentSubjects.map(subject => [subject.subjectCode, subject])).values(),
    );
    const uniqueHumanitySubjects = Array.from(
      new Map(humanitySubjects.map(subject => [subject.subjectCode, subject])).values(),
    );

    const departmentRandomSubjects = getRandomItems(uniqueDepartmentSubjects, 3);
    const humanityRandomSubjects = getRandomItems(uniqueHumanitySubjects, 2);

    const allRandomSubjects = [...departmentRandomSubjects, ...humanityRandomSubjects];
    const randomSubjects: SimulationSubject[] = getRandomItems(allRandomSubjects, allRandomSubjects.length).map(
      (subject, idx) => ({
        id: subject.subjectId || idx,
        subjectCode: subject.subjectCode,
        classCode: subject.classCode,
        departmentName: subject.departmentName,
        subjectName: subject.subjectName,
        professorName: subject.professorName || '',
        language: subject.language || '',
        subjectType: subject.subjectType || '',
        semester_at: typeof subject.semester_at === 'number' ? subject.semester_at : 0,
        lesn_time: subject.lesn_time || '',
        lesn_room: subject.lesn_room || '',
      }),
    );

    setSubjects(randomSubjects);
  };

  useEffect(() => {
    generateRandomSubjects();
  }, [department]);

  return (
    <Modal>
      <div className="w-full max-w-3xl overflow-hidden bg-white rounded-lg border-2 border-gray-300">
        <ModalHeader title="수강 신청 게임을 시작하시겠습니까?" onClose={() => {}} />

        <div className="p-6">
          <div className="flex flex-row justify-between">
            <h2 className="text-left font-semibold mb-4">내 관심 과목 리스트</h2>
            <button onClick={generateRandomSubjects} className="flex items-center gap-2 cursor-pointer">
              랜덤 관심 과목 재생성
              <ResetSvg />
            </button>
          </div>

          <SubjectTable subjects={subjects} />

          <div className="mt-4 flex items-center">
            <input type="checkbox" id="confirm" className="mr-2" />
            <label htmlFor="confirm" className="text-sm text-gray-700">
              관심과목을 확인하였습니다.
            </label>
          </div>

          <GameTips />

          <div className="pt-6 text-right">
            <button
              onClick={() => {}}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
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
