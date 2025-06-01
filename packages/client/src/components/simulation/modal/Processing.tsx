import Modal from '@/components/simulation/modal/Modal';

function ProcessingModal() {
  return (
    <Modal>
      <div className="p-6 w-80 bg-white rounded shadow">
        <p className="text-sm text-gray-800 mb-4">데이터 처리중 입니다.</p>
        <div className="w-full h-4 bg-gray-200 rounded overflow-hidden">
          <div className="h-full bg-blue-400 bg-gradient-to-r from-blue-400 to-blue-600 animate-stripes" />
        </div>
      </div>
    </Modal>
  );
}

export default ProcessingModal;
