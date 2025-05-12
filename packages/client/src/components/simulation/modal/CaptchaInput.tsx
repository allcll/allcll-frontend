import { useEffect, useRef } from 'react';
import Modal from '@/components/simulation/modal/Modal';
import ModalHeader from '@/components/simulation/modal/ModalHeader';
import { drawCaptcha } from '@/utils/captcha';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import { APPLY_STATUS, BUTTON_EVENT, triggerButtonEvent } from '@/utils/simulation/simulation';

function generateNumericText() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function CaptchaInput() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const codeRef = useRef<string>('');

  const { closeModal, openModal } = useSimulationModalStore();
  const { setSubjectStatus, currentSubjectId } = useSimulationSubjectStore();
  const { setSubjectsStatus, subjectsStatus } = useSimulationProcessStore();
  const currentSubjectStatus = subjectsStatus.find(subject => subject.subjectId === currentSubjectId);

  function handleRefreshCaptcha() {
    const randomCaptchaCode = generateNumericText();
    codeRef.current = randomCaptchaCode;

    setTimeout(() => {
      if (canvasRef.current) {
        drawCaptcha(canvasRef.current, randomCaptchaCode);
      }
    }, 300);
  }

  useEffect(() => {
    setTimeout(() => {
      handleRefreshCaptcha();
    }, 300);
  }, []);

  function handleConfirm() {
    /**
     * 캡차 버튼 클릭 이벤트
     */
    triggerButtonEvent({ eventType: BUTTON_EVENT.CAPTCHA, subjectId: currentSubjectId });

    /**
     * 캡차 입력 검증
     */
    const inputValue = inputRef.current?.value;

    if (inputValue === codeRef.current) {
      if (currentSubjectStatus?.subjectStatus !== APPLY_STATUS.DOUBLED) {
        setSubjectsStatus(currentSubjectId, APPLY_STATUS.PROGRESS);
      }
    } else {
      setSubjectsStatus(currentSubjectId, APPLY_STATUS.PROGRESS, true);
      setSubjectStatus(currentSubjectId, APPLY_STATUS.CAPTCHA_FAILED);
    }

    closeModal('captcha');
    openModal('simulation');
  }

  return (
    <Modal>
      <div className="w-[500px] bg-white rounded shadow p-4">
        <ModalHeader title="매크로방지 코드입력 (Arti-marco code input)" onClose={() => closeModal('captcha')} />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold flex flex-row items-center">
              <span className="inline-block w-1.5 h-5 bg-blue-500 mr-2 "></span>생성된 코드
              <button
                onClick={handleRefreshCaptcha}
                className="ml-2 px-2 py-1 bg-blue-500 text-white text-sm rounded-xs cursor-pointer hover:bg-blue-600"
              >
                재생성
              </button>
            </label>

            <div className="flex items-center mt-1">
              <canvas id="captcha" width="105" height="50" ref={canvasRef} />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold  flex flex-row items-center">
              <span className="inline-block w-1.5 h-5 bg-blue-500 mr-2 "></span>생성된 코드 입력
            </label>
            <input
              type="text"
              ref={inputRef}
              className="mt-2 w-full border-1 border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-gray-800"
              placeholder="코드를 입력하세요"
            />
          </div>
        </div>

        <p className="text-sm text-gray-800 mt-10">
          ※ 코드가 표시되지 않는 경우 잠시 기다리거나 매크로 방지 코드 입력 창을 닫고 새로 열어 주세요.
        </p>

        <div className="flex justify-end border-t px-6 py-4 gap-3 bg-gray-100 text-xs">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-white hover:bg-blue-50 rounded-xs border cursor-pointer"
          >
            코드입력
          </button>
          <button
            onClick={() => closeModal('captcha')}
            className="px-4 py-2 bg-white hover:bg-blue-50 rounded-xs border cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default CaptchaInput;
