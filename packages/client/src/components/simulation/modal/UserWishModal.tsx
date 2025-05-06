import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import CheckSvg from '@/assets/check.svg?react';

interface Subject {
  id: number;
  code: string;
  section: string;
  department: string;
  title: string;
  professor: string;
}

const subjects: Subject[] = Array(5)
  .fill(0)
  .map((_, i) => ({
    id: i,
    code: 'CSE102',
    section: '001',
    department: '컴퓨터공학과',
    title: '프로그래밍기초',
    professor: '이교수',
  }));

function UserWishModal() {
  return (
    <Modal>
      <div className="w-full max-w-3xl overflow-hidden bg-white rounded-lg border-2 border-gray-300">
        <ModalHeader title="수강 신청 게임을 시작하시겠습니까?" onClose={() => {}} />

        <div className="p-6">
          <h2 className="text-left font-semibold mb-4">내 관심 과목 리스트</h2>
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
                  <td className="px-4 py-2">{subject.code}</td>
                  <td className="px-4 py-2">{subject.section}</td>
                  <td className="px-4 py-2">{subject.department}</td>
                  <td className="px-4 py-2">{subject.title}</td>
                  <td className="px-4 py-2">{subject.professor}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 체크박스 영역 */}
          <div className="mt-4 flex items-center">
            <input type="checkbox" id="confirm" className="mr-2" />
            <label htmlFor="confirm" className="text-sm text-gray-700">
              관심과목을 확인하였습니다.
            </label>
          </div>

          {/* Tip 영역 */}
          <div className="mt-6 text-sm text-gray-800 space-y-2">
            <h2 className="text-left font-semibold mb-4">게임 Tip!</h2>

            <div className="flex items-center">
              <span className="text-green-500 mr-2">
                <CheckSvg />
              </span>
              인기 있는 과목을 먼저 잡으세요.
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">
                <CheckSvg />
              </span>
              시작 시 검색 버튼을 빠르게 눌러주세요.
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">
                <CheckSvg />
              </span>
              한 번 담은 과목을 또 담지 않도록 주의하세요!
            </div>
          </div>

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
