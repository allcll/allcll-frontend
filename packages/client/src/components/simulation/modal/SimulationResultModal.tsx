import Modal from '@/components/simulation/modal/Modal.tsx';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';

function SimulationResultModal() {
  const { closeModal } = useSimulationModalStore();
  return (
    <Modal>
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-float1 absolute top-6 left-6 w-3 h-3 bg-red-400 rounded-full" />
          <div className="animate-float2 absolute top-16 right-10 w-2 h-2 bg-yellow-400 rounded-full" />
          <div className="animate-float3 absolute bottom-20 left-12 w-2.5 h-2.5 bg-blue-400 rounded-full" />
          <div className="animate-float4 absolute bottom-10 right-6 w-3 h-3 bg-pink-400 rounded-full" />
          <div className="animate-float5 absolute top-1/2 left-1/2 w-2 h-2 bg-purple-400 rounded-full" />
        </div>

        <div className="relative z-10 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            수강 신청 <span className="text-blue-600">성공!</span>
          </h2>
          <p className="text-sm text-gray-700 mt-1">수강신청을 성공 하셨습니다!</p>

          <div className="my-6 flex justify-center">
            <img src="/ci.svg" alt="축하 아이콘" className="w-20 h-20" />
          </div>

          <div className="text-left text-sm text-gray-800 mt-4 mb-1">소요 시간</div>
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-3 bg-indigo-400 w-[70%] rounded-full transition-all duration-300" />
            </div>
            <span className="text-xs text-gray-600 whitespace-nowrap">00 : 00 : 30</span>
          </div>

          <div className="text-left text-sm text-gray-800 mt-4 mb-1">정확도</div>
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-3 bg-indigo-400 w-[90%] rounded-full transition-all duration-300" />
            </div>
            <span className="text-xs text-gray-600 whitespace-nowrap">90%</span>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button
              className="px-4 py-2 border border-gray-400 text-gray-800 rounded-md hover:bg-gray-100 text-sm"
              onClick={() => {
                closeModal('result');
              }}
            >
              다시 하기
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              onClick={() => {
                closeModal('result');
              }}
            >
              자세히 보기
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float1 {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        @keyframes float2 {
          0% { transform: translateY(0); }
          50% { transform: translateY(6px); }
          100% { transform: translateY(0); }
        }
        @keyframes float3 {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        @keyframes float4 {
          0% { transform: translateY(0); }
          50% { transform: translateY(4px); }
          100% { transform: translateY(0); }
        }
        @keyframes float5 {
          0% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }

        .animate-float1 { animation: float1 3s ease-in-out infinite; }
        .animate-float2 { animation: float2 4s ease-in-out infinite; }
        .animate-float3 { animation: float3 2.5s ease-in-out infinite; }
        .animate-float4 { animation: float4 3.5s ease-in-out infinite; }
        .animate-float5 { animation: float5 3s ease-in-out infinite; }
      `}</style>
    </Modal>
  );
}

export default SimulationResultModal;
