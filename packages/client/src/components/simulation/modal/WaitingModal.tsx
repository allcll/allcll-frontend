import Modal from '@/components/simulation/modal/Modal.tsx';

function WaitingModal() {
  return (
    <Modal>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center space-y-6">
        {/* 상단 제목 */}
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          서비스 <span className="text-blue-600 font-bold">접속대기 중</span>입니다.
        </h2>

        {/* 예상 대기 시간 */}
        <div className="text-sm md:text-base text-gray-600">
          예상대기시간: <span className="text-blue-600 font-bold text-xl">05</span>초
        </div>

        {/* 진행 바 */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 w-[90%] transition-all duration-300"></div>
        </div>

        {/* 대기 인원 안내 */}
        <div className="text-gray-700 text-sm md:text-base leading-relaxed">
          고객님 앞에 <span className="text-green-600 font-bold text-xl">733</span>명 뒤에{' '}
          <span className="text-green-600 font-bold text-xl">1</span>명의 대기자가 있습니다. <br />
          현재 접속 사용자가 많아 대기 중이며, 잠시만 기다리시면 서비스로 자동 접속 됩니다.
        </div>

        {/* 중지 버튼 */}
        <button className="inline-flex items-center justify-center border-2 border-gray-400 text-gray-800 px-2 py-1 hover:bg-gray-100">
          {/* SVG 아이콘 위치 */}
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          중지
        </button>

        {/* 안내 문구 */}
        <p className="text-xs md:text-sm text-gray-500">재 접속하시면 대기시간이 더 길어집니다.</p>
      </div>
    </Modal>
  );
}

export default WaitingModal;
