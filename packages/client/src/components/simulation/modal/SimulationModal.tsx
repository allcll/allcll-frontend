import { useEffect, useRef } from 'react';
import CheckBlueSvg from '@/assets/check-blue.svg?react';
import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import { useSimulationAction } from '@/hooks/simulation/useSimulationAction.ts';
import { APPLY_STATUS } from '@/utils/simulation/simulation';

function SimulationModal() {
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  const { modalData, handleConfirm, handleCancel, handleClose } = useSimulationAction();
  const cancelable = modalData?.status === APPLY_STATUS.PROGRESS || modalData?.status === APPLY_STATUS.SUCCESS;

  useEffect(() => {
    confirmBtnRef.current?.focus();
  }, [modalData]);

  if (!modalData) return null;

  return (
    <Modal onClose={() => {}}>
      <div className="flex sm:w-[450px] border-1 border-gray-800 flex-col justify-between overflow-hidden">
        <ModalHeader title="" onClose={handleClose} />

        <div className="px-6 pb-6 text-center ">
          <div className="flex justify-center mb-4 py-5">
            <div className="w-10 h-10">
              <CheckBlueSvg />
            </div>
          </div>

          <p className="text-gray-700 text-base mb-4">{modalData.topMessage}</p>

          {modalData.description && (
            <p className="text-sm text-gray-700 whitespace-pre-line">{modalData.description}</p>
          )}
        </div>

        <div className="flex justify-end  px-6 py-4 gap-3 bg-gray-100 text-xs">
          {cancelable && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white hover:bg-blue-50 rounded-xs border cursor-pointer"
            >
              취소
            </button>
          )}
          <button
            ref={confirmBtnRef}
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xs cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default SimulationModal;
