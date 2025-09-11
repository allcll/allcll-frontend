import React, { useEffect, useRef, useState } from 'react';
import Modal from '@/components/simulation/modal/Modal';
import ModalHeader from '@/components/simulation/modal/ModalHeader';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject';
import useLectures from '@/hooks/server/useLectures';
import { drawCaptcha } from '@/utils/captcha';
import { APPLY_STATUS, BUTTON_EVENT, triggerButtonEvent } from '@/utils/simulation/simulation';

function generateNumericText() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const CAPTCHA_LENGTH = 4;

function CaptchaInput() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [captchaInput, setCaptchaInput] = useState<string>('');
  const [infoMessage, setInfoMessage] = useState<string>('');
  const codeRef = useRef<string>('');
  const { data: lectures } = useLectures();

  const { openModal, closeModal } = useSimulationModalStore.getState();
  const { currentSubjectId, setSubjectStatus, setCaptchaFailed } = useSimulationSubjectStore();

  function handleRefreshCaptcha() {
    const randomCaptchaCode = generateNumericText();
    codeRef.current = randomCaptchaCode;

    setTimeout(() => {
      if (canvasRef.current) {
        drawCaptcha(canvasRef.current, randomCaptchaCode);
      }
    }, 100);
  }

  function handleChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    let inputValue = event.target.value;

    if (/[^0-9]/.test(inputValue)) {
      setInfoMessage('0~9까지의 숫자만 입력해주세요');
      setCaptchaInput(inputValue.replace(/[^0-9]/g, ''));
      return;
    }

    if (inputValue.length > CAPTCHA_LENGTH) {
      setInfoMessage('4자리까지 입력 가능합니다');
      return;
    }

    setCaptchaInput(inputValue);
    setInfoMessage('');
  }

  useEffect(() => {
    setTimeout(() => {
      handleRefreshCaptcha();
    }, 100);
  }, []);

  function handleConfirmCaptcha() {
    triggerButtonEvent({ eventType: BUTTON_EVENT.CAPTCHA, subjectId: currentSubjectId }, lectures)
      .then(() => {
        if (captchaInput?.toString() === codeRef.current) {
          setSubjectStatus(currentSubjectId, APPLY_STATUS.PROGRESS);
          setCaptchaFailed(false);
        } else {
          setSubjectStatus(currentSubjectId, APPLY_STATUS.PROGRESS);
          setCaptchaFailed(true);
        }
      })
      .then(() => {
        closeModal();
        openModal('simulation');
      });
  }

  function closeCaptcha() {
    triggerButtonEvent({ eventType: BUTTON_EVENT.CANCEL_SUBMIT, subjectId: currentSubjectId }, lectures).then(() => {
      closeModal('captcha');
      setSubjectStatus(currentSubjectId, APPLY_STATUS.PROGRESS);
      setCaptchaFailed(false);
    });
  }

  return (
    <Modal onClose={() => {}} preventAutoFocus>
      <div className="sm:w-[500px] bg-white rounded shadow">
        <ModalHeader title="매크로방지 코드입력 (Arti-marco code input)" onClose={closeCaptcha} />

        <div className="grid grid-cols-2 gap-4 mt-4 p-4">
          <div className="flex flex-col">
            <div className="text-sm font-semibold flex flex-row items-center">
              <span className="inline-block w-1.5 h-5 bg-blue-500 mr-2 "></span>생성된 코드
              <button
                onClick={handleRefreshCaptcha}
                className="ml-2 px-2 py-1 bg-blue-500 text-white text-sm rounded-xs cursor-pointer hover:bg-blue-600"
              >
                재생성
              </button>
            </div>

            <div className="flex items-center mt-1">
              <canvas id="captcha" width="105" height="50" ref={canvasRef} />
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold  flex flex-row items-center">
              <span className="inline-block w-1.5 h-5 bg-blue-500 mr-2 "></span>생성된 코드 입력
            </div>
            <input
              type="text"
              value={captchaInput}
              onChange={e => handleChangeInput(e)}
              className="mt-2 w-full border-1 border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-gray-800"
              placeholder="코드를 입력하세요"
            />
            <span className="pl-1 text-xs text-red-500 ">{infoMessage}</span>
          </div>
        </div>

        <p className="text-sm text-gray-800 mt-10 p-4">
          ※ 코드가 표시되지 않는 경우 잠시 기다리거나 매크로 방지 코드 입력 창을 닫고 새로 열어 주세요.
        </p>

        <div className="flex justify-end border-t px-6 py-4 gap-3 bg-gray-100 text-xs">
          <button
            onClick={handleConfirmCaptcha}
            className="px-4 py-2 bg-white hover:bg-blue-50 rounded-xs border cursor-pointer"
          >
            코드입력
          </button>
          <button
            onClick={closeCaptcha}
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
