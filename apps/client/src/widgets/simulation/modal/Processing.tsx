import SejongUI from '@allcll/sejong-ui';
import { useSimulationModalStore } from '@/features/simulation/model/useSimulationModal.ts';

function ProcessingModal() {
  const closeModal = useSimulationModalStore(state => state.closeModal);
  return (
    <SejongUI.Modal onBackdropClick={() => closeModal()} noBorder>
      <div className="p-6 w-80 bg-surface rounded shadow">
        <p className="text-sm text-fg mb-4">데이터 처리중 입니다.</p>
        <div className="w-full h-4 bg-surface-strong rounded overflow-hidden">
          <div className="h-full bg-primary-400 bg-gradient-to-r from-primary-400 to-primary-600 animate-stripes" />
        </div>
      </div>
    </SejongUI.Modal>
  );
}

export default ProcessingModal;
