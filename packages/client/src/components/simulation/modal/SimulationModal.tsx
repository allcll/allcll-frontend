import Modal from '@/components/simulation/modal/Modal.tsx';
import ModalHeader from '@/components/simulation/modal/ModalHeader.tsx';
import CheckBlueSvg from '@/assets/check-blue.svg?react';
import { useSimulationModalStore } from '@/store/simulation/useSimulationModal';
import useSimulationSubjectStore from '@/store/simulation/useSimulationSubject';
import useSimulationProcessStore from '@/store/simulation/useSimulationProcess';
import {
  APPLY_STATUS,
  BUTTON_EVENT,
  forceStopSimulation,
  isSimulationFinished,
  triggerButtonEvent,
} from '@/utils/simulation/simulation';
import { checkSubjectResult } from '@/utils/checkSubjectResult';

const SIMULATION_MODAL_CONTENTS = [
  {
    status: APPLY_STATUS.PROGRESS,
    topMessage: '선택한 과목을 수강신청 하시겠습니까?',
    description: '교과목명(CourseTitle):',
  },
  {
    status: APPLY_STATUS.SUCCESS,
    topMessage: '과목이 신청 되었습니다. 수강신청내역을 재 조회 하시겠습니까?',
    description:
      '※ 취소를 선택하실 경우 [수강신청내역]이 갱신되지 않습니다. 취소를 선택하실 경우 수강신청 최종 완료 후 반드시 [수강신청내역] 재 조회를 눌러 신청 내역을 확인하세요. [수강신청내역]에 조회된 과목만이 정상적으로 수강신청된 과목입니다.',
  },
  {
    status: APPLY_STATUS.FAILED,
    topMessage: '수강 여석이 없습니다!',
  },
  {
    status: APPLY_STATUS.DOUBLED,
    topMessage: '이미 수강신청 된 과목입니다!',
  },
  {
    status: APPLY_STATUS.CAPTCHA_FAILED,
    topMessage: '입력하신 코드가 일치하지 않습니다',
  },
  {
    status: APPLY_STATUS.NOT_ELIGIBLE,
    topMessage: '수강신청 대상 학과가 아닙니다',
  },
];

function SimulationModal() {
  const { closeModal, openModal } = useSimulationModalStore();
  const { currentSubjectId, setSubjectStatus, stopTimer, getElapsedTime } = useSimulationSubjectStore();
  const { subjectsStatus, setSubjectsStatus, resetSimulation } = useSimulationProcessStore();

  const currentSubjectStatus = subjectsStatus.find(subject => subject.subjectId === currentSubjectId);
  const modalData = SIMULATION_MODAL_CONTENTS.find(data => data.status === currentSubjectStatus?.subjectStatus);

  if (!modalData) return null;

  const handleSubjectResult = async () => {
    /**
     * 확인 버튼 클릭했을 때 , 모달의 타입이
     * PROGRESS일 때,
     */
    if (modalData.status === APPLY_STATUS.PROGRESS) {
      if (currentSubjectStatus?.isCaptchaFailed) {
        setSubjectStatus(currentSubjectId, APPLY_STATUS.CAPTCHA_FAILED);
        setSubjectsStatus(currentSubjectId, APPLY_STATUS.CAPTCHA_FAILED);
        closeModal('simulation');
        openModal('simulation');
      } else {
        /**
         *캡차를 잘 입력한 경우 -> 경과 시간에 따라서
         *과목의 성공/실패 판별
         */
        stopTimer();

        const elapsedTime = getElapsedTime();
        console.log(elapsedTime);
        const isSuccess = checkSubjectResult(currentSubjectId, elapsedTime);

        if (!isSuccess) {
          setSubjectStatus(currentSubjectId, APPLY_STATUS.FAILED);
          setSubjectsStatus(currentSubjectId, APPLY_STATUS.FAILED);
        } else {
          setSubjectStatus(currentSubjectId, APPLY_STATUS.SUCCESS);
          setSubjectsStatus(currentSubjectId, APPLY_STATUS.SUCCESS);
        }

        closeModal('simulation');
        openModal('simulation');
      }
    } else if (modalData.status === APPLY_STATUS.CAPTCHA_FAILED) {
      setSubjectStatus(currentSubjectId, APPLY_STATUS.CANCELED);
      setSubjectsStatus(currentSubjectId, APPLY_STATUS.CANCELED);
      closeModal('simulation');
    } else if (currentSubjectStatus?.subjectStatus === APPLY_STATUS.DOUBLED) {
      openModal('simulation');
      closeModal('simulation');
    } else {
      closeModal('simulation');
    }

    if (modalData?.status === APPLY_STATUS.SUCCESS || APPLY_STATUS.FAILED) {
      /**
       * 과목 신청 완료 -> 과목 담기 종료 이벤트
       */
      triggerButtonEvent({
        eventType: BUTTON_EVENT.REFRESH,
        subjectId: currentSubjectId,
        status: modalData.status,
      })
        .then(result => {
          if ('errMsg' in result) {
            alert('시뮬레이션이 존재하지 않습니다. ');
          }
        })
        .catch(e => {
          console.error('예외 발생:', e);
        })
        .then(() => {
          return isSimulationFinished();
        })
        .then(result => {
          if (result) {
            forceStopSimulation();
            resetSimulation();
            openModal('result');
          }
        });
    }
  };

  const handleClickCancle = async () => {
    /**
     * 취소 버튼 클릭했을 때, 모달의 타입이
     * SUCCESS이거나 FAILED일 때 과목 신청 완료, 시뮬레이션 종료 확인
     */
    if (modalData?.status === APPLY_STATUS.SUCCESS || APPLY_STATUS.FAILED) {
      triggerButtonEvent({
        eventType: BUTTON_EVENT.SKIP_REFRESH,
        subjectId: currentSubjectId,
        status: modalData.status,
      })
        .then(async result => {
          if ('errMsg' in result) {
            alert('시뮬레이션이 존재하지 않습니다.');
            forceStopSimulation();
            resetSimulation();
            openModal('result');
          } else {
            const isFinishSimulation = await isSimulationFinished();

            if (isFinishSimulation) {
              forceStopSimulation();
              resetSimulation();
              openModal('result');
            }
          }
        })
        .catch(e => {
          console.error('예외 발생:', e);
        });

      closeModal('simulation');
    }
  };

  return (
    <Modal>
      <div className="w-full max-w-md overflow-hidden bg-white border-1 border-gray-600">
        <ModalHeader
          title=""
          onClose={() => {
            closeModal('simulation');
          }}
        />

        <div className="px-6 pb-6 text-center">
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
          {modalData.status === APPLY_STATUS.PROGRESS ||
            (APPLY_STATUS.SUCCESS && (
              <button
                onClick={handleClickCancle}
                className="px-4 py-2 bg-white hover:bg-blue-50 rounded-xs border cursor-pointer"
              >
                취소
              </button>
            ))}
          <button
            onClick={handleSubjectResult}
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
