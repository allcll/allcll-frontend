import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';

function SimulationModal() {
  return (
    <Modal>
      <div className="w-full max-w-md overflow-hidden bg-white border-2 border-gray-600">
        {/* 닫기 버튼 */}
        <ModalHeader title="" onClose={() => {}} />

        {/* 본문 */}
        <div className="px-6 pb-6 text-center">
          {/* 체크 아이콘 */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10">
              {/* SVG 아이콘 삽입 */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>

          {/* 텍스트 */}
          <p className="text-gray-900 font-medium text-base mb-4">
            과목이 신청 되었습니다. 수강신청내역을 재 조회 하시겠습니까?
          </p>

          <p className="text-sm text-gray-700 mb-2">취소를 선택하실 경우 [수강신청내역]이 갱신되지 않습니다.</p>
          <p className="text-sm text-gray-700">
            취소를 선택하실 경우 수강신청 최종 완료 후 반드시 [수강신청내역] 재 조회를 눌러 신청 내역을 확인하세요.
            [수강신청내역]에 조회된 과목만이 정상적으로 수강신청된 과목입니다.
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end border-t px-6 py-4 gap-3 bg-gray-100 text-xs">
          <button className="px-4 py-2 bg-white hover:bg-blue-50 rounded-xs border cursor-pointer">취소</button>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xs cursor-pointer">확인</button>
        </div>
      </div>
    </Modal>
  );
}

export default SimulationModal;
